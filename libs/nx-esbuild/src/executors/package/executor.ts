import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import { detectPackageManager } from 'nx/src/shared/package-manager'
import path from 'path'
import buildExecutor from '../build/executor'
import { PackageExecutorSchema } from './schema'

export default async function runExecutor(
    options: PackageExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const packageManager = detectPackageManager()
    const appRoot = context.workspace.projects[context.projectName].root
    const workspaceRoot = context.root

    if (packageManager !== 'pnpm' && packageManager !== 'yarn') {
        throw new Error('Currently only pnpm and yarn are supported')
    }

    const beforeZipHook = options.beforeZip
    const afterZipHook = options.afterZip
    const singleZip = options.singleZip
    // Need to remove off build options
    delete options.beforeZip
    delete options.singleZip
    delete options.afterZip

    const outdir =
        options.outdir || (options.outfile && path.dirname(options.outfile))
    if (!outdir) {
        throw new Error('Cannot calculate outdir')
    }
    const entryPoints = options.entryPoints
    if (!Array.isArray(entryPoints)) {
        throw new Error('Expecting entryPoints to be an array')
    }

    const result = await buildExecutor(options, context)
    if (!result.success) {
        return result
    }

    const outbase = options.outbase || lowestCommonAncestor(...entryPoints)

    for (const entryPoint of entryPoints) {
        console.log(`> Packaging ${entryPoint}`)
        const entryPointDir = path.dirname(entryPoint)
        const dir = entryPointDir.replace(outbase || entryPointDir, '')
        const name = path.parse(entryPoint).name
        const entrypointOutDir = path.join(outdir, dir)

        if (existsSync(path.join(entryPointDir, 'package.json'))) {
            await fs.copyFile(
                path.join(entryPointDir, 'package.json'),
                path.join(entrypointOutDir, 'package.json'),
            )
        } else if (existsSync(path.join(appRoot, 'package.json'))) {
            await fs.copyFile(
                path.join(appRoot, 'package.json'),
                path.join(entrypointOutDir, 'package.json'),
            )
        }

        await installNodeModulesIntoPackageDir(
            packageManager,
            entrypointOutDir,
            entryPointDir,
            appRoot,
            workspaceRoot,
        )

        if (!singleZip) {
            if (beforeZipHook) {
                await execa.command(beforeZipHook, {
                    cwd: entrypointOutDir,
                    stdio: [process.stdin, process.stdout, 'pipe'],
                })
            }

            // This prob needs to check platform to make it cross platform
            // But need to instruct it to keep symlinks
            const relativeZipLocation = `../${dir || name}.zip`
            console.log(
                `> Writing ${path.relative(
                    process.cwd(),
                    path.resolve(entrypointOutDir, relativeZipLocation),
                )}`,
            )
            await execa('zip', ['-rqy', relativeZipLocation, `.`], {
                cwd: entrypointOutDir,
                stdio: [process.stdin, process.stdout, 'pipe'],
            })

            if (afterZipHook) {
                await execa.command(afterZipHook, {
                    cwd: outdir,
                    stdio: [process.stdin, process.stdout, 'pipe'],
                })
            }
        }
    }

    if (singleZip) {
        if (beforeZipHook) {
            await execa.command(beforeZipHook, {
                cwd: outdir,
                stdio: [process.stdin, process.stdout, 'pipe'],
            })
        }

        // This prob needs to check platform to make it cross platform
        // But need to instruct it to keep symlinks
        const relativeZipLocation = `../${outdir
            .split('/')
            .slice(-1)
            .pop()}.zip`
        console.log(
            `> Writing ${path.relative(
                process.cwd(),
                path.resolve(outdir, relativeZipLocation),
            )}`,
        )
        await execa('zip', ['-rqy', relativeZipLocation, `.`], {
            cwd: outdir,
            stdio: [process.stdin, process.stdout, 'pipe'],
        })

        if (afterZipHook) {
            await execa.command(afterZipHook, {
                cwd: outdir,
                stdio: [process.stdin, process.stdout, 'pipe'],
            })
        }
    }

    return {
        success: true,
    }
}

async function installNodeModulesIntoPackageDir(
    packageManager: string,
    entrypointOutDir: string,
    entryPointDir: string,
    appRoot: string,
    workspaceRoot: string,
) {
    if (packageManager === 'pnpm') {
        // This creates a lockfile based on the lambda/project package.json
        // https://github.com/pnpm/pnpm/issues/2198#issuecomment-669623478
        await execa('pnpx', ['make-dedicated-lockfile'], {
            cwd: entrypointOutDir,
            stdio: [process.stdin, process.stdout, 'pipe'],
        })

        // Need to add this, otherwise pnpm will find the workspace one and not put the .pnpm folder in the dist folder.
        // This has to be done after we have generated the dedicated lockfile from the main lockfile
        // https://github.com/pnpm/pnpm/discussions/3427#discussioncomment-716016
        await fs.writeFile(
            path.join(entrypointOutDir, 'pnpm-workspace.yaml'),
            '',
        )

        // Now install, it will install into the dist folder and virtual store will be in that folder too
        await execa('pnpm', ['install'], {
            cwd: entrypointOutDir,
            stdio: [process.stdin, process.stdout, 'pipe'],
        })
    } else if (packageManager === 'yarn') {
        // similar to pnpx make-dedicated-lockfile, just use the project lockfile
        if (existsSync(path.join(entryPointDir, 'yarn.lock'))) {
            await fs.copyFile(
                path.join(entryPointDir, 'yarn.lock'),
                path.join(entrypointOutDir, 'yarn.lock'),
            )
        } else if (existsSync(path.join(appRoot, 'yarn.lock'))) {
            await fs.copyFile(
                path.join(appRoot, 'yarn.lock'),
                path.join(entrypointOutDir, 'yarn.lock'),
            )
        } else if (existsSync(path.join(workspaceRoot, 'yarn.lock'))) {
            await fs.copyFile(
                path.join(workspaceRoot, 'yarn.lock'),
                path.join(entrypointOutDir, 'yarn.lock'),
            )
        }

        await execa('yarn', ['install', '--prod'], {
            cwd: entrypointOutDir,
            stdio: [process.stdin, process.stdout, 'pipe'],
        })
    }
}

function lowestCommonAncestor(...filepaths: string[]) {
    if (filepaths.length <= 1) return ''
    const [first, ...rest] = filepaths
    let ancestor = first.split(path.sep)
    for (const filepath of rest) {
        filepath //?
        const directories = filepath.split(path.sep, ancestor.length)
        let index = 0
        for (const directory of directories) {
            if (directory === ancestor[index]) {
                index += 1
            } else {
                ancestor = ancestor.slice(0, index)
                break
            }
        }
        ancestor = ancestor.slice(0, index)
    }

    return ancestor.length <= 1 && ancestor[0] === ''
        ? path.sep + ancestor[0]
        : ancestor.join(path.sep)
}

import { ExecutorContext } from '@nrwl/devkit'
import { detectPackageManager } from '@nrwl/tao/src/shared/package-manager'
import execa from 'execa'
import { existsSync } from 'fs'
import fs from 'fs/promises'
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

    if (packageManager !== 'pnpm') {
        throw new Error('Currently only PNPM is supported')
    }
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

    if (packageManager === 'pnpm') {
        const outbase = options.outbase || lowestCommonAncestor(...entryPoints)

        for (const entryPoint of entryPoints) {
            const entryPointDir = path.dirname(entryPoint)
            const dir = entryPointDir.replace(outbase || entryPointDir, '')
            const name = path.parse(entryPoint).name
            const entrypointOutDir = path.join(outdir, dir)
            await execa('pnpx', ['make-dedicated-lockfile'], {
                cwd: entrypointOutDir,
                stdio: [process.stdin, process.stdout, 'pipe'],
            })

            await fs.writeFile(
                path.join(entrypointOutDir, 'pnpm-workspace.yaml'),
                '',
            )

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

            await execa('pnpm', ['install'], {
                cwd: entrypointOutDir,
                stdio: [process.stdin, process.stdout, 'pipe'],
            })
            // This prob needs to check platform
            await execa('zip', ['-rqy', `../${name}.zip`, `.`], {
                cwd: entrypointOutDir,
                stdio: [process.stdin, process.stdout, 'pipe'],
            })
        }
    }

    return {
        success: true,
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

import { ServeExecutorSchema } from './schema'
import execa from 'execa'
import { ExecutorContext } from '@nrwl/devkit'
import { getEsbuildArgs } from '../../common/get-esbuild-args'

export default async function runExecutor(
    options: ServeExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const appRoot = context.workspace.projects[context.projectName].root

    const args = getEsbuildArgs(
        options,
        appRoot,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        Object.keys(require(`${appRoot}/package.json`).dependencies),
    )

    const esbuild = execa('esbuild', [...args, '--watch'])
    esbuild.stdout?.pipe(process.stdout)
    esbuild.stderr?.pipe(process.stderr)
    if (esbuild.all) {
        for await (const chunk of esbuild.all) {
            // Wait until the first build is finished before starting nodemon
            if (chunk.includes('build finished, watching for changes...')) {
                break
            }
        }
    }

    const nodemon = execa('nodemon', [
        '-r',
        'dotenv/config',
        '--enable-source-maps',
        `${appRoot}/dist/bundle.js`,
        `--watch`,
        `${appRoot}/dist/bundle.js`,
    ])
    nodemon.stdout?.pipe(process.stdout)
    nodemon.stderr?.pipe(process.stderr)
    await Promise.race([esbuild, nodemon])
    if (esbuild.connected) {
        esbuild.cancel()
    }
    if (nodemon.connected) {
        nodemon.cancel()
    }

    return {
        success: true,
    }
}

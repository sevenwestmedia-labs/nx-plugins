import { ExecutorContext } from '@nrwl/devkit'
import execa from 'execa'
import { FsTree } from 'nx/src/config/tree'
import { getPackageManagerCommand } from 'nx/src/utils/package-manager'
import { ServeExecutorSchema } from './schema'

export default async function runExecutor(
    options: ServeExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const packageManager = getPackageManagerCommand()
    const tree = new FsTree(context.cwd, context.isVerbose)
    const appRoot = context.workspace.projects[context.projectName].root

    const root = `${tree.root}/${appRoot}`
    const configFile = options.configFile

    const vite = execa(
        packageManager.exec,
        ['vite', root, ...(configFile ? ['--config', configFile] : []), '--open'],
        {
            stdio: [process.stdin, process.stdout, 'pipe'],
        },
    )

    await vite

    if (vite.connected) {
        vite.cancel()
    }

    return {
        success: true,
    }
}

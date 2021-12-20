import { ExecutorContext } from '@nrwl/devkit'
import { getPackageManagerCommand } from '@nrwl/tao/src/shared/package-manager'
import { FsTree } from '@nrwl/tao/src/shared/tree'
import execa from 'execa'
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
    const configFile = options.configFile || `${root}/vite.config.js`

    const vite = execa(
        packageManager.exec,
        ['vite', root, '--config', configFile ,'--open'],
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

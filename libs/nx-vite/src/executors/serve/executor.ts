import { ExecutorContext } from '@nrwl/devkit'
import { FsTree } from '@nrwl/tao/src/shared/tree'
import execa from 'execa'
import { ServeExecutorSchema } from './schema'

export default async function runExecutor(
    _options: ServeExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const tree = new FsTree(context.cwd, context.isVerbose)
    const appRoot = context.workspace.projects[context.projectName].root

    const vite = execa(
        `vite`,
        [`${tree.root}/${appRoot}`, '--open'],
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

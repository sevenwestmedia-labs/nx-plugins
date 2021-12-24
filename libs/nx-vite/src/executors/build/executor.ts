import { ExecutorContext } from '@nrwl/devkit'
import { FsTree } from '@nrwl/tao/src/shared/tree'
import { build } from 'vite'
import { BuildExecutorSchema } from './schema'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const tree = new FsTree(context.cwd, context.isVerbose)
    const appRoot = context.workspace.projects[context.projectName].root

    const root = tree.root + '/' + appRoot
    const configFile = options.configFile

    await build({
        root,
        configFile
    })

    return {
        success: true,
    }
}

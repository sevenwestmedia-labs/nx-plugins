import { ExecutorContext } from '@nrwl/devkit'
import { FsTree } from '@nrwl/tao/src/shared/tree'
import { build } from 'vite'
import { BuildExecutorSchema } from './schema'
import { join } from 'path';

export default async function runExecutor(
    _options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const tree = new FsTree(context.cwd, context.isVerbose)
    const appRoot = context.workspace.projects[context.projectName].root

    await build({
        root: join(tree.root, appRoot),
        build: {
            outputDir: join(tree.root, ('dist/apps/' + context.projectName)),
        },
    })

    return {
        success: true,
    }
}

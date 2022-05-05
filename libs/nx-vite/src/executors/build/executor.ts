import { ExecutorContext } from '@nrwl/devkit'
import { build } from 'vite'
import { BuildExecutorSchema } from './schema'

export default async function runExecutor(
    _options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const appRoot = context.workspace.projects[context.projectName].root

    await build({
        root: context.cwd + '/' + appRoot,
    })

    return {
        success: true,
    }
}

import { ExecutorContext } from '@nrwl/devkit'
import { join } from 'path'
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
    const outputPath = _options?.outputPath
        ? join(context.cwd, _options.outputPath)
        : undefined

    await build({
        root: context.cwd + '/' + appRoot,
        build: {
            outDir: outputPath,
        },
    })

    return {
        success: true,
    }
}

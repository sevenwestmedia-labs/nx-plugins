import { ExecutorContext } from '@nx/devkit'
import * as path from 'path'
import { build, InlineConfig } from 'vite'
import { BuildExecutorSchema } from './schema'

export default async function runExecutor(
    _options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }

    const appRoot =
        context.projectsConfigurations?.projects[context.projectName].root

    const buildConfig: InlineConfig = {
        root: context.cwd + '/' + appRoot,
    }

    if (_options?.outputPath) {
        buildConfig.build = {
            outDir: path.join(context.cwd, _options.outputPath),
        }
    }

    await build(buildConfig)

    return {
        success: true,
    }
}

import { BuildExecutorSchema } from './schema'
import execa from 'execa'
import { ExecutorContext } from '@nrwl/devkit'
import { getEsbuildArgs } from '../../common/get-esbuild-args'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const libRoot = context.workspace.projects[context.projectName].root

    const args = getEsbuildArgs(options, libRoot)

    const esbuild = execa('esbuild', args)
    esbuild.stdout?.pipe(process.stdout)
    esbuild.stderr?.pipe(process.stderr)
    await esbuild

    return {
        success: true,
    }
}

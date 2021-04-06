import { BuildExecutorSchema } from './schema'
import execa from 'execa'
import { ExecutorContext } from '@nrwl/devkit'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    const esbuild = execa('esbuild', [
        `--bundle`,
        `--sourcemap`,
        `--platform=${options.platform || 'node'}`,
        `--target=${options.target || 'node12'}`,
        ...(options.externals || [])?.map(
            (external) => `--external:${external}`,
        ),
        `--outfile=${options.outfile || `${context.root}/dist/bundle.js`}`,
    ])

    esbuild.stdout?.pipe(process.stdout)
    await esbuild

    return {
        success: true,
    }
}

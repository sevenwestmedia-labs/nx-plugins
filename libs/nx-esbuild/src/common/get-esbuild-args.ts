import { BuildExecutorSchema } from '../executors/build/schema'
import { ServeExecutorSchema } from '../executors/serve/schema'

export function getEsbuildArgs(
    options: BuildExecutorSchema | ServeExecutorSchema,
    libRoot: string,
    packageJsonDependencies: string[],
    packageJsonDevDependencies: string[],
) {
    return [
        options.entry || `${libRoot}/src/index.ts`,
        ...('entries' in options ? options.entries || [] : []),
        `--bundle`,
        `--sourcemap`,
        `--platform=${options.platform || 'node'}`,
        `--target=${options.target || 'node12'}`,
        ...(options.externals || [])
            .concat(packageJsonDependencies)
            .concat(packageJsonDevDependencies)
            .map((external) => `--external:${external}`),
        'outdir' in options && options.outdir
            ? `--outdir=${options.outdir}`
            : `--outfile=${options.outfile || `${libRoot}/dist/bundle.js`}`,
    ]
}

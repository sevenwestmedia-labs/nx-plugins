import { ExecutorContext } from '@nx/devkit'
import { build } from 'esbuild'
import fs from 'node:fs'
import { BuildExecutorSchema } from './schema'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const appRoot =
        context.projectsConfigurations?.projects[context.projectName].root

    const packageJson = fs.existsSync(`${appRoot}/package.json`)
        ? JSON.parse(fs.readFileSync(`${appRoot}/package.json`).toString())
        : {}

    Object.keys(options).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (options as any)[key]
        // NX or json schema default objects to an empty object, this can cause issues with esbuild
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (options as any)[key]
        }
    })

    const result = await build({
        bundle: true,
        sourcemap: true,
        logLevel: 'info',
        metafile: true,
        ...options,
        external: [
            ...(options.external || []),
            ...Object.keys(packageJson?.dependencies || {}),
            ...Object.keys(packageJson?.devDependencies || {}),
        ],
        plugins: options.plugins?.map((plugin) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const pluginPkg = require(plugin.package)
            return 'default' in pluginPkg
                ? pluginPkg.default(plugin.args)
                : pluginPkg(plugin.args)
        }),
    })

    return {
        success: !result.errors?.length,
    }
}

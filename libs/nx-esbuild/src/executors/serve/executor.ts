import { ExecutorContext, readJson } from '@nrwl/devkit'
import { detectPackageManager } from '@nrwl/tao/src/shared/package-manager'
import { FsTree } from '@nrwl/tao/src/shared/tree'
import { build } from 'esbuild'
import execa from 'execa'
import { ServeExecutorSchema } from './schema'

export default async function runExecutor(
    options: ServeExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    if (!options.outfile) {
        throw new Error('Need to specify outfile in watch mode')
    }

    const packageManager = detectPackageManager()
    const packageManagerCmd =
        packageManager === 'pnpm'
            ? 'pnpx'
            : packageManager === 'yarn'
            ? 'yarn'
            : 'npx'
    const appRoot = context.workspace.projects[context.projectName].root
    const tree = new FsTree(context.cwd, context.isVerbose)

    const packageJson = tree.exists(`${appRoot}/package.json`)
        ? readJson(tree, `${appRoot}/package.json`)
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

    await build({
        bundle: true,
        sourcemap: true,
        watch: true,
        logLevel: 'info',
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

    const serveProcess = options.serveCommand
        ? execa.command(options.serveCommand, {
              stdio: [process.stdin, process.stdout, 'pipe'],
          })
        : execa(
              packageManagerCmd,
              [
                  'nodemon',
                  '-r',
                  'dotenv/config',
                  '--enable-source-maps',
                  options.outfile,
                  `--watch`,
                  options.outfile,
              ],
              {
                  stdio: [process.stdin, process.stdout, 'pipe'],
              },
          )
    await serveProcess
    if (serveProcess.connected) {
        serveProcess.cancel()
    }

    return {
        success: true,
    }
}

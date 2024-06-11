/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { detectPackageManager, ExecutorContext } from '@nx/devkit'
import { build } from 'esbuild'
import execa from 'execa'
import fs from 'node:fs'
import { ServeExecutorSchema } from './schema'

export default async function runExecutor(
    options: ServeExecutorSchema,
    context: ExecutorContext,
) {
    const customServeCommand = options.serveCommand
    const customServeCommandCwd = options.serveCommandCwd
    delete options.serveCommand
    delete options.serveCommandCwd
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    // Only require a single entrypoint when no custom serve command is specfied
    if (!options.outfile && !customServeCommand) {
        throw new Error('Need to specify outfile in watch mode')
    }
    if (customServeCommandCwd && !customServeCommand) {
        throw new Error(
            'Need to specify serveCommand when serveCommandCwd is specified',
        )
    }

    const packageManager = detectPackageManager()
    const packageManagerCmd =
        packageManager === 'pnpm'
            ? 'pnpm'
            : packageManager === 'yarn'
            ? 'yarn'
            : 'npx'
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

    const serveProcess = customServeCommand
        ? execa.command(customServeCommand, {
              stdio: [process.stdin, process.stdout, 'pipe'],
              cwd: customServeCommandCwd,
          })
        : execa(
              packageManagerCmd,
              [
                  'nodemon',
                  '-r',
                  'dotenv/config',
                  '--enable-source-maps',
                  options.outfile!,
                  `--watch`,
                  options.outfile!,
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

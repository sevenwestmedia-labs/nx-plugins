import {
    checkFilesExist,
    ensureNxProject,
    runCommandAsync,
    runNxCommandAsync,
    uniq,
} from '@nrwl/nx-plugin/testing'
import 'regenerator-runtime'

jest.setTimeout(60000)

describe('nx-esbuild e2e', () => {
    it('should create nx-esbuild', async () => {
        const plugin = uniq('nx-esbuild')
        ensureNxProject('@wanews/nx-esbuild', 'libs/nx-esbuild')
        await runCommandAsyncHandlingError('pnpm install')
        await runCommandAsyncHandlingError(
            'npm add esbuild nodemon dotenv --dev',
        )

        await runNxCommandAsync(`generate @wanews/nx-esbuild:node ${plugin}`)

        const result = await runNxCommandAsync(`build ${plugin}`)
        // Ensure bundle exists on disk
        await new Promise((resolve) => setTimeout(resolve, 100))

        checkFilesExist(`apps/${plugin}/dist/bundle.js`)

        await runNxCommandAsync(`package ${plugin}`)
        // Ensure bundle exists on disk
        await new Promise((resolve) => setTimeout(resolve, 100))

        checkFilesExist(`apps/${plugin}/dist/bundle.js`)
    })
})

async function runNxCommandAsyncHandlingError(command: string) {
    try {
        await runNxCommandAsync(command)
    } catch (err) {
        console.error(
            'Command failure',
            await runNxCommandAsync(command, { silenceError: true }),
        )
        throw err
    }
}

async function runCommandAsyncHandlingError(command: string) {
    try {
        await runCommandAsync(command)
    } catch (err) {
        console.error(
            'Command failure',
            await runCommandAsync(command, { silenceError: true }),
        )
        throw err
    }
}

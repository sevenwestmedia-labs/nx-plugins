import {
    checkFilesExist,
    ensureNxProject,
    runCommandAsync,
    runNxCommandAsync,
    uniq,
} from '@nx/plugin/testing'
import { describe, it } from 'vitest'

describe('nx-esbuild e2e', () => {
    it('should create nx-esbuild', async () => {
        const plugin = uniq('nx-esbuild')
        ensureNxProject('@wanews/nx-esbuild', 'libs/nx-esbuild')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            'npm add esbuild nodemon dotenv --dev',
        )

        await runNxCommandAsync(`generate @wanews/nx-esbuild:node ${plugin}`)

        await runNxCommandAsync(`build ${plugin}`)
        // Ensure bundle exists on disk
        await new Promise((resolve) => setTimeout(resolve, 100))

        checkFilesExist(`apps/${plugin}/dist/bundle.js`)
    }, 60000)
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

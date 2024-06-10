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
        console.debug(`1) Beginning to build test variables...`)

        const plugin = uniq('nx-esbuild')

        console.debug(`2) Test variables built, let's ensure nx project...`)

        ensureNxProject('@wanews/nx-esbuild', 'libs/nx-esbuild')
        await runCommandAsyncHandlingError('npm install')

        console.debug(
            `3) Now let's npm install and add esbuild, nodemon & dotenv as dev dependencies...`,
        )

        await runCommandAsyncHandlingError(
            'npm add esbuild nodemon dotenv --dev',
        )

        console.debug(
            `4) Now let's generate a new nx-esbuild:node project with the id of: '${plugin}'...`,
        )

        await runNxCommandAsync(
            `generate @wanews/nx-esbuild:node ${plugin} --directory=apps`,
        )

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

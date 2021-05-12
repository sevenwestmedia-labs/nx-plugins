import 'regenerator-runtime'
import {
    ensureNxProject,
    runCommandAsync,
    runNxCommandAsync,
    uniq,
    checkFilesExist,
} from '@nrwl/nx-plugin/testing'

jest.setTimeout(60000)

describe('nx-vite e2e', () => {
    it('should create nx-vite', async () => {
        const plugin = uniq('nx-vite')
        ensureNxProject('@wanews/nx-vite', 'libs/nx-vite')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            'npm add react react-dom vite @vitejs/plugin-react-refresh vite-tsconfig-paths --dev',
        )

        await runNxCommandAsync(`generate @wanews/nx-vite:react ${plugin}`)

        const result = await runNxCommandAsync(`build ${plugin}`)
        // Ensure bundle exists on disk
        await new Promise((resolve) => setTimeout(resolve, 100))

        checkFilesExist(`apps/${plugin}/dist/index.html`)
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

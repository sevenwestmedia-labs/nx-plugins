import {
    checkFilesExist,
    ensureNxProject,
    runCommandAsync,
    runNxCommandAsync,
    uniq,
    updateFile,
} from '@nrwl/nx-plugin/testing'
import 'regenerator-runtime'

jest.setTimeout(120000)

describe('nx-vite e2e', () => {
    it('should create nx-vite', async () => {
        const plugin = uniq('nx-vite')
        ensureNxProject('@wanews/nx-vite', 'libs/nx-vite')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            'npm add react react-dom vite @vitejs/plugin-react-refresh vite-tsconfig-paths vitest --dev',
        )

        await runNxCommandAsync(`generate @wanews/nx-vite:react ${plugin}`)

        updateFile(
            `apps/${plugin}/src/example.spec.ts`,
            `import { assert, expect, it } from 'vitest'

it('passes', () => {
    expect(1).toEqual(1)
})
`,
        )

        const result = await runNxCommandAsync(`build ${plugin}`)
        const testResult = await runNxCommandAsync(`test ${plugin}`)
        // Ensure bundle exists on disk
        await new Promise((resolve) => setTimeout(resolve, 100))

        checkFilesExist(`apps/${plugin}/dist/index.html`)

        expect(result.stderr).toEqual('')
        expect(testResult.stderr).toEqual('')
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

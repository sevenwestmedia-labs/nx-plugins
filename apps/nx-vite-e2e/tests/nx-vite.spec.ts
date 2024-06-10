import {
    checkFilesExist,
    ensureNxProject,
    readJson,
    runCommandAsync,
    runNxCommandAsync,
    uniq,
    updateFile,
} from '@nx/plugin/testing'
import { describe, expect, it } from 'vitest'

describe('nx-vite e2e', () => {
    it('should create nx-vite', async () => {
        console.debug(`1) Beginning to build test variables...`)

        const plugin = uniq('nx-vite')

        console.debug(`2) Test variables built, let's ensure nx project...`)

        ensureNxProject('@wanews/nx-vite', 'libs/nx-vite')

        console.debug(
            `3) Now let's npm install and add react, react-dom, vite, vitejs, vitest, vite-tsconfig-paths as dev dependencies...`,
        )

        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            'npm add react react-dom vite @vitejs/plugin-react-refresh vite-tsconfig-paths vitest --dev',
        )

        console.debug(
            `4) Now let's generate a new nx-vite:react project with the id of: '${plugin}'...`,
        )

        await runNxCommandAsync(
            `generate @wanews/nx-vite:react ${plugin} --directory=apps`,
        )

        console.debug(`5) Create an example.spec.ts test file...`)

        updateFile(
            `apps/${plugin}/src/example.spec.ts`,
            `import { assert, expect, it } from 'vitest'

it('passes', () => {
    expect(1).toEqual(1)
})
`,
        )

        console.debug(
            `6) Copy over the tsconfig.base.json from the CWD to the E2E file...`,
        )

        copyBaseTsConfigToE2E()

        console.debug(`7) Lets now build the project...`)

        const result = await runNxCommandAsync(`build ${plugin}`)

        console.debug(`8) Build successful! Now let's test the project...`)

        const testResult = await runNxCommandAsync(`test ${plugin}`)

        console.debug(
            `9) Test successful! Now let's ensure the bundle is on the disk...`,
        )

        // Ensure bundle exists on disk
        await new Promise((resolve) => setTimeout(resolve, 100))

        checkFilesExist(`apps/${plugin}/dist/index.html`)

        expect(result.stderr).toEqual('')
        expect(testResult.stderr).toEqual('')
    }, 120000)
})

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

export function copyBaseTsConfigToE2E() {
    updateFile(
        `tsconfig.base.json`,
        JSON.stringify(
            readJson(process.cwd() + `/tsconfig.base.json`),
            null,
            2,
        ),
    )
}

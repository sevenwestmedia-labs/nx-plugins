import {
    ensureNxProject,
    runNxCommandAsync,
    runCommandAsync,
    uniq,
    cleanup,
} from '@nrwl/nx-plugin/testing'

jest.setTimeout(60000)

describe('typescript-project-references e2e', () => {
    it('should create typescript-project-references', async () => {
        const libName = uniq('lib')
        const appName = uniq('app')
        ensureNxProject(
            '@wanews/nx-typescript-project-references',
            'dist/libs/typescript-project-references',
        )

        await runNxCommandAsync(
            `generate @nrwl/workspace:library --name=${libName} --no-interactive`,
        )
        await runNxCommandAsync(
            `generate @nrwl/node:application --name=${appName} --babelJest`,
        )

        await runNxCommandAsync(
            `generate @wanews/nx-typescript-project-references:migrate`,
        )

        // Ensure it can all build
        await runCommandAsync('tsc -b')
    })

    beforeAll(() => {
        cleanup()
    })
})

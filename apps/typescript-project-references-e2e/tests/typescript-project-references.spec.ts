import {
    ensureNxProject,
    runNxCommandAsync,
    runCommandAsync,
    uniq,
    cleanup,
    updateFile,
    readFile,
} from '@nrwl/nx-plugin/testing'

jest.setTimeout(200000)

describe('typescript-project-references e2e', () => {
    it('should create typescript-project-references', async () => {
        const libName = uniq('lib')
        // TODO create second library and make lib 1 reference lib 2.
        // This will flush out issues like https://github.com/aleclarson/vite-tsconfig-paths/issues/12
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

        await runCommandAsyncHandlingError(
            'npm add tsconfig-paths-jest esbuild-jest esbuild --dev',
        )
        // await runCommandAsyncHandlingError('npm remove ts-jest')

        await runNxCommandAsync(
            `generate @wanews/nx-typescript-project-references:migrate`,
        )

        updateFile(
            `./apps/${appName}/src/main.ts`,
            `import { ${libName} } from '@proj/${libName}'

console.log(${libName}())`,
        )
        updateFile(
            `./apps/${appName}/src/main.spec.ts`,
            `import { ${libName} } from '@proj/${libName}'

it('it looks at source, not built', () => {
    expect(${libName}()).toEqual('updated')
})`,
        )

        updateFile(
            `./apps/${appName}/tsconfig.json`,
            readFile(`./apps/${appName}/tsconfig.json`).replace(
                '"include":',
                `"references": [{ "path": "../../libs/${libName}" }],
  "include":`,
            ),
        )

        // Ensure it can all build
        await runCommandAsyncHandlingError('tsc -b')

        // Update source
        updateFile(
            `./libs/${libName}/src/lib/${libName}.ts`,
            `export function ${libName}(): string {
    return 'updated';
}`,
        )

        // Run the test in app which asserts against the latest library source.
        await runNxCommandAsyncHandlingError(`test ${appName}`)
    })

    beforeAll(() => {
        cleanup()
    })
})

async function runNxCommandAsyncHandlingError(command: string) {
    try {
        await runNxCommandAsync(command)
    } catch (err) {
        console.error(
            'Command failure',
            await runCommandAsync(command, { silenceError: true }),
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

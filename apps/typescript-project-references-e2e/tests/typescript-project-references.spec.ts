import 'regenerator-runtime'
import {
    ensureNxProject,
    runNxCommandAsync,
    runCommandAsync,
    uniq,
    cleanup,
    updateFile,
    readFile,
    readJson,
} from '@nrwl/nx-plugin/testing'

jest.setTimeout(200000)

describe('typescript-project-references e2e', () => {
    it('should create typescript-project-references', async () => {
        const libName = uniq('lib')
        // This will flush out issues like https://github.com/aleclarson/vite-tsconfig-paths/issues/12
        const lib2Name = uniq('lib')
        const appName = uniq('app')
        ensureNxProject(
            '@wanews/nx-typescript-project-references',
            'libs/typescript-project-references',
        )

        await runNxCommandAsync(
            `generate @nrwl/workspace:library --name=${libName} --no-interactive`,
        )
        await runNxCommandAsync(
            `generate @nrwl/workspace:library --name=${lib2Name} --no-interactive`,
        )
        await runNxCommandAsync(
            `generate @nrwl/node:application --name=${appName} --babelJest`,
        )

        await runCommandAsyncHandlingError('npm add tsup esbuild --dev')
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

        // Update TS Project references so app -> lib
        addTsConfigReference(
            `./apps/${appName}/tsconfig.json`,
            `../../libs/${libName}`,
        )
        // Update TS Project references so lib -> lib2
        addTsConfigReference(
            `./libs/${libName}/tsconfig.json`,
            `../../libs/${lib2Name}`,
        )

        // Ensure it can all build
        await runCommandAsyncHandlingError('tsc -b')

        // Update source of lib to import from lib2
        updateFile(
            `./libs/${libName}/src/lib/${libName}.ts`,
            `import { ${lib2Name} } from '@proj/${lib2Name}'

export function ${libName}(): string {
    return ${lib2Name}();
}`,
        )

        // Update source of lib to return 'updated' string literal
        updateFile(
            `./libs/${lib2Name}/src/lib/${lib2Name}.ts`,
            `export function ${lib2Name}(): string {
    return 'updated';
}`,
        )

        // Run the test in app which asserts against the latest library source.
        await runNxCommandAsyncHandlingError(`test ${appName}`)

        // Ensure the jest VSCode plugin can run tests
        await runCommandAsyncHandlingError(
            `node './node_modules/.bin/jest' './apps/${appName}/src/main.spec.ts' -c './apps/${appName}/jest.config.js' -t 'it looks at source, not built'`,
        )

        updateWorkspaceConfig((workspace) => {
            workspace.projects[libName].targets.package = {
                executor: '@wanews/nx-typescript-project-references:package',
                options: {
                    main: `libs/${libName}/src/index.ts`,
                    tsConfig: `libs/${libName}/tsconfig.json`,
                },
            }
            return workspace
        })

        await runNxCommandAsyncHandlingError(`run ${libName}:package`)
    })

    beforeAll(() => {
        cleanup()
    })
})

function addTsConfigReference(tsConfigPath: string, target: string) {
    const source = JSON.parse(readFile(tsConfigPath))
    source.references = [...(source.references || []), { path: target }]
    updateFile(tsConfigPath, JSON.stringify(source, undefined, 2))
}

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

export function updateWorkspaceConfig(
    callback: (json: { [key: string]: any }) => Object,
) {
    updateFile(
        'workspace.json',
        JSON.stringify(callback(readJson('workspace.json')), null, 2),
    )
}

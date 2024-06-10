import {
    cleanup,
    ensureNxProject,
    patchPackageJsonForPlugin,
    readFile,
    readJson,
    runCommandAsync,
    runNxCommandAsync,
    uniq,
    updateFile,
} from '@nx/plugin/testing'
import { beforeAll, describe, it } from 'vitest'

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
        await runCommandAsyncHandlingError('npm install')
        await runNxCommandAsync(
            `generate @nx/workspace:library --name=${libName} --no-interactive`,
        )
        await runNxCommandAsync(
            `generate @nx/workspace:library --name=${lib2Name} --no-interactive`,
        )
        patchPackageJsonForPlugin('@wanews/nx-esbuild', 'libs/nx-esbuild')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-esbuild:node ${appName}`,
        )
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-typescript-project-references:migrate`,
        )
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            'npm add tsup esbuild nodemon dotenv --dev',
        )

        updateFile(
            `./apps/${appName}/src/main.ts`,
            `import { ${libName} } from '@proj/${libName}'

console.log(${libName}())`,
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

        updateLibraryPackageJson(libName, (packageJson) => ({
            ...packageJson,
            dependencies: {
                ...(packageJson.dependencies || {}),
                [`@proj/${lib2Name}`]: '*',
            },
        }))

        updateProjectConfig('libs', libName, (config) => {
            config.targets.package = {
                executor: '@wanews/nx-typescript-project-references:package',
                options: {
                    main: `libs/${libName}/src/index.ts`,
                    tsConfig: `libs/${libName}/tsconfig.json`,
                },
            }
            return config
        })

        await runNxCommandAsyncHandlingError(`run ${libName}:package`)
    }, 120000)

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

export function updateProjectConfig(
    type: 'libs' | 'apps',
    project: string,
    callback: (json: { [key: string]: any }) => Object,
) {
    const file = `${type}/${project}/project.json`
    updateFile(file, JSON.stringify(callback(readJson(file)), null, 2))
}

export function updateLibraryPackageJson(
    libName: string,
    callback: (json: { [key: string]: any }) => Object,
) {
    updateFile(
        `libs/${libName}/package.json`,
        JSON.stringify(
            callback(readJson(`libs/${libName}/package.json`)),
            null,
            2,
        ),
    )
}

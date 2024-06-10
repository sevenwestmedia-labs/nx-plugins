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
        console.debug(`1) Beginning to build test variables...`)

        const libName = uniq('lib')
        // This will flush out issues like https://github.com/aleclarson/vite-tsconfig-paths/issues/12
        const lib2Name = uniq('lib')
        const appName = uniq('app')

        console.debug(`2) Test variables built, let's ensure nx project...`)

        ensureNxProject(
            '@wanews/nx-typescript-project-references',
            'libs/typescript-project-references',
        )

        console.debug(
            `3) Now let's npm install and generate lib1: '${libName}'...`,
        )

        await runCommandAsyncHandlingError('npm install')
        await runNxCommandAsync(
            `generate @nx/js:library --name=${libName} --no-interactive`,
        )

        console.debug(`4) Now let's generate lib2: '${lib2Name}'...`)

        await runNxCommandAsync(
            `generate @nx/js:library --name=${lib2Name} --no-interactive`,
        )

        console.debug(
            `5) Now let's patch packages, re-run npm install and generate a node with appName: ${appName}...`,
        )

        patchPackageJsonForPlugin('@wanews/nx-esbuild', 'libs/nx-esbuild')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-esbuild:node ${appName}`,
        )

        console.debug(
            `6) Re-run of npm install and run nx-typescript-project-references:migrate...`,
        )

        await runCommandAsyncHandlingError('npm install')

        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-typescript-project-references:migrate`,
        )

        console.debug(
            `7) Re-run npm install, and add tsup, esbuild, nodemon, dotenv as dev packages...`,
        )
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            'npm add tsup esbuild nodemon dotenv --dev',
        )

        console.debug(
            `8) All installs complete. Let's now configure some packages! Update ${appName} to contain a main.ts...`,
        )

        updateFile(
            `./${appName}/src/main.ts`,
            `import { ${libName} } from '@proj/${libName}'

console.log(${libName}())`,
        )

        console.debug(
            `9) Now let's direct the ${appName} tsconfig.json to ${libName}...`,
        )

        // Update TS Project references so app -> lib
        addTsConfigReference(`${appName}/tsconfig.json`, `../${libName}`)

        console.debug(
            `10) Now let's direct the ${libName} tsconfig.json to ${lib2Name}...`,
        )

        // Update TS Project references so lib -> lib2
        addTsConfigReference(`${libName}/tsconfig.json`, `../${lib2Name}`)

        console.debug(`11) Let's try to build them all now...`)

        // Ensure it can all build
        await runCommandAsyncHandlingError('tsc -b')

        console.debug(
            `12) Let's add a '${libName}.ts' to './${libName}/src/lib'...`,
        )

        // Update source of lib to import from lib2
        updateFile(
            `./${libName}/src/lib/${libName}.ts`,
            `import { ${lib2Name} } from '@proj/${lib2Name}'

export function ${libName}(): string {
    return ${lib2Name}();
}`,
        )

        console.debug(
            `13) Let's add a '${lib2Name}.ts' to './${lib2Name}/src/lib'...`,
        )

        // Update source of lib to return 'updated' string literal
        updateFile(
            `./${lib2Name}/src/lib/${lib2Name}.ts`,
            `export function ${lib2Name}(): string {
    return 'updated';
}`,
        )

        console.debug(
            `14) Now let's update the '${libName}' library package json...`,
        )

        updateLibraryPackageJson(libName, (packageJson) => ({
            ...packageJson,
            dependencies: {
                ...(packageJson.dependencies || {}),
                [`@proj/${lib2Name}`]: '*',
            },
        }))

        console.debug(
            `15) Now let's update the project config for ${libName}...`,
        )

        updateProjectConfig(libName, (config) => {
            config.targets.package = {
                executor: '@wanews/nx-typescript-project-references:package',
                options: {
                    main: `${libName}/src/index.ts`,
                    tsConfig: `${libName}/tsconfig.json`,
                },
            }
            return config
        })

        console.debug(
            `16) Now let's try run the package command: 'run ${libName}:package'...`,
        )

        await runNxCommandAsyncHandlingError(`run ${libName}:package`)
    }, 120000)

    beforeAll(() => {
        cleanup()
    })
})

function addTsConfigReference(tsConfigPath: string, target: string) {
    console.debug(`Cwd: ${process.cwd()}`)
    console.debug(
        `About to add TsConfigReference from ${tsConfigPath} to ${target}`,
    )

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
    project: string,
    callback: (json: { [key: string]: any }) => Object,
) {
    const file = `${project}/project.json`
    updateFile(file, JSON.stringify(callback(readJson(file)), null, 2))
}

export function updateLibraryPackageJson(
    libName: string,
    callback: (json: { [key: string]: any }) => Object,
) {
    updateFile(
        `${libName}/package.json`,
        JSON.stringify(callback(readJson(`${libName}/package.json`)), null, 2),
    )
}

import {
    ensureNxProject,
    patchPackageJsonForPlugin,
    readJson,
    runCommandAsync,
    uniq,
} from '@nx/plugin/testing'
import { describe, expect, it } from 'vitest'

describe('init e2e', () => {
    it('should create infrastructure project', async () => {
        console.debug(`1) Beginning to build test variables...`)

        const app = uniq('app')

        console.debug(`2) Test variables built, let's ensure nx project...`)

        ensureNxProject('@wanews/nx-esbuild', 'libs/nx-esbuild')

        console.debug(
            `3) Now let's npm install and generate nx-esbuild:node ${app}...`,
        )

        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-esbuild:node ${app}`,
        )

        console.debug(`4) Patch the json for plugin...`)

        patchPackageJsonForPlugin('@wanews/nx-pulumi', 'libs/pulumi')

        console.debug(`5) Re-run npm install, and nx-pulumi:init a ${app}...`)

        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-pulumi:init --projectName ${app} --tags infrastructure`,
        )

        console.debug(
            `6) Now let's add esbuild, nodemon, dotenv to dev dependencies...`,
        )

        await runCommandAsyncHandlingError(
            'npm add esbuild nodemon dotenv --dev',
        )

        console.debug(
            `7) Now let's do a few tests to compare the '${app}/project.json'...`,
        )

        const appProjectJson = readJson(`${app}/project.json`)
        expect(appProjectJson.targets).toMatchObject({
            deploy: {
                executor: 'nx:run-commands',
                options: {
                    commands: [`nx run ${app}-infrastructure:up`],
                },
            },
        })

        console.debug(
            `8) Now let's do a test to compare the '${app}-infrastructure/project.json'...`,
        )

        const appInfrastructureProjectJson = readJson(
            `${app}-infrastructure/project.json`,
        )
        expect(appInfrastructureProjectJson).toMatchObject({
            projectType: 'application',
            sourceRoot: `${app}-infrastructure/src`,
            targets: {
                lint: {
                    executor: '@nx/eslint:lint',
                    options: {
                        lintFilePatterns: [`${app}-infrastructure/**/*.ts`],
                    },
                },
                test: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'npx vitest --run',
                        cwd: `${app}-infrastructure`,
                    },
                },
                up: {
                    executor: '@wanews/nx-pulumi:up',
                    options: {
                        buildTargets: [
                            {
                                project: app,
                                target: 'build',
                            },
                        ],
                    },
                },
            },
            tags: ['infrastructure'],
            implicitDependencies: [app],
        })
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

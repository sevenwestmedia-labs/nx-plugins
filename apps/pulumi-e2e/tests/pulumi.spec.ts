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
        const app = uniq('app')
        ensureNxProject('@wanews/nx-esbuild', 'libs/nx-esbuild')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-esbuild:node ${app}`,
        )

        patchPackageJsonForPlugin('@wanews/nx-pulumi', 'libs/pulumi')
        await runCommandAsyncHandlingError('npm install')
        await runCommandAsyncHandlingError(
            `npx nx generate @wanews/nx-pulumi:init --projectName ${app} --tags infrastructure`,
        )
        await runCommandAsyncHandlingError(
            'npm add esbuild nodemon dotenv --dev',
        )

        const appProjectJson = readJson(`apps/${app}/project.json`)
        expect(appProjectJson.targets).toMatchObject({
            deploy: {
                executor: 'nx:run-commands',
                options: {
                    commands: [`nx run ${app}-infrastructure:up`],
                },
            },
        })
        const appInfrastructureProjectJson = readJson(
            `apps/${app}-infrastructure/project.json`,
        )
        expect(appInfrastructureProjectJson).toMatchObject({
            projectType: 'application',
            sourceRoot: `apps/${app}-infrastructure/src`,
            targets: {
                lint: {
                    executor: '@nx/eslint:lint',
                    options: {
                        lintFilePatterns: [
                            `apps/${app}-infrastructure/**/*.ts`,
                        ],
                    },
                },
                test: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'npx vitest --run',
                        cwd: `apps/${app}-infrastructure`,
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

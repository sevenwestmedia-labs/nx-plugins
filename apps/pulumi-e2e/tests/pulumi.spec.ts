import {
    ensureNxProject,
    readJson,
    runNxCommandAsync,
    uniq,
} from '@nrwl/nx-plugin/testing'
import { describe, expect, it } from 'vitest'

describe('init e2e', () => {
    it('should create infrastructure project', async () => {
        const app = uniq('app')
        ensureNxProject('@wanews/nx-pulumi', 'libs/pulumi')
        await runNxCommandAsync(
            `generate @nrwl/node:application --name=${app} --no-interactive`,
        )
        await runNxCommandAsync(
            `generate @wanews/nx-pulumi:init --projectName ${app} --tags infrastructure`,
        )

        const appProjectJson = readJson(`apps/${app}/project.json`)
        expect(appProjectJson.targets).toMatchObject({
            deploy: {
                executor: '@nrwl/workspace:run-commands',
                options: {
                    commands: [`nx run ${app}-infrastructure:up`],
                },
            },
        })
        const appInfrastructureProjectJson = readJson(
            `apps/${app}-infrastructure/project.json`,
        )
        expect(appInfrastructureProjectJson).toEqual({
            implicitDependencies: [app],
            projectType: 'application',
            root: `apps/${app}-infrastructure`,
            sourceRoot: `apps/${app}-infrastructure/src`,
            tags: ['infrastructure'],
            targets: {
                lint: {
                    executor: '@nrwl/linter:eslint',
                    options: {
                        lintFilePatterns: [
                            `apps/${app}-infrastructure/**/*.ts`,
                        ],
                    },
                },
                test: {
                    executor: '@nrwl/workspace:run-commands',
                    options: {
                        command: 'npx vitest --run',
                        cwd: `libs/${app}-infrastructure/src`,
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
        })
    }, 120000)
})

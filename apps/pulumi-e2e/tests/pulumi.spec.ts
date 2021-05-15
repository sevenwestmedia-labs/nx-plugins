import {
    ensureNxProject,
    readJson,
    runNxCommandAsync,
    uniq,
} from '@nrwl/nx-plugin/testing'
import 'regenerator-runtime'

jest.setTimeout(200000)

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

        const workspaceJson = readJson('workspace.json')
        expect(workspaceJson.projects[app].targets).toMatchObject({
            up: {
                executor: '@wanews/nx-pulumi:up',
            },
        })
        expect(workspaceJson.projects[`${app}-infrastructure`]).toEqual({
            projectType: 'application',
            root: `apps/${app}-infrastructure`,
            sourceRoot: `apps/${app}-infrastructure/src`,
            targets: {
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
                        executor: '@nrwl/jest:jest',
                        options: {
                            jestConfig: `apps/${app}-infrastructure/jest.config.js`,
                            passWithNoTests: true,
                        },
                        outputs: [`coverage/apps/${app}-infrastructure`],
                    },
                },
            },
        })
    })
})

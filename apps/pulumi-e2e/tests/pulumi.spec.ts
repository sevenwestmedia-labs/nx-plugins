import 'regenerator-runtime'
import {
    ensureNxProject,
    readJson,
    runNxCommandAsync,
    uniq,
} from '@nrwl/nx-plugin/testing'

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
            targets: {},
        })
    })
})

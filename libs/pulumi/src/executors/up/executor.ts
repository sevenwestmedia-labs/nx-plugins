import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import execa from 'execa'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { BuildExecutorSchema } from './schema'

export default async function runUpExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }

    const infrastructureProject = options.infrastructureProject
        ?? `${context.projectName}-infrastructure`

    const infrastructureRoot =
        context.workspace.projects[
            infrastructureProject
        ].root

    console.log(
        `> nx run ${options.targetProjectName}:${
            options.buildTarget ?? 'build'
        }:production`,
    )

    const buildTargets = options.buildTargets ?? []
    const deprecatedBuildTarget = options.buildTarget ? [{
        project: options.targetProjectName,
        target: options.buildTarget ?? 'build',
        configuration: 'production',
    }] : []
    const deprecatedAdditionalBuildTargets
        = options.additionalBuildTargets ?? []

    for (const buildTarget of [
        ...buildTargets,
        ...deprecatedBuildTarget,
        ...deprecatedAdditionalBuildTargets,
     ]) {
        console.log(
            `> nx run ${buildTarget.project}:${
                buildTarget.target
            }${
                buildTarget.configuration
                    ? `:${buildTarget.configuration}`
                    : ''
            }`,
        )
        for await (const s of await runExecutor(
            buildTarget,
            {},
            {
                ...context,
                configurationName: buildTarget.configuration,
            },
        )) {
            if (!s.success) {
                return {
                    success: false,
                }
            }
        }
    }

    const pulumiArguments = process.argv.slice(4)
    const stackFormat =
        options.configurationStackFormat || '[projectName].[configuration]'
    const stackFromConfiguration =
        context.configurationName && !pulumiArguments.includes('--stack')
            ? [
                  '--stack',
                  stackFormat
                      .replace(
                          '[projectName]',
                          (
                              yaml.load(
                                  fs
                                      .readFileSync(
                                          path.join(
                                              infrastructureRoot,
                                              'Pulumi.yaml',
                                          ),
                                      )
                                      .toString(),
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              ) as any
                          ).name,
                      )
                      .replace('[configuration]', context.configurationName),
              ]
            : []
    const pulumiArgs = [
        'up',
        '--cwd',
        infrastructureRoot,
        ...pulumiArguments,
        ...stackFromConfiguration,
    ]
    console.log(`> pulumi ${pulumiArgs.join(' ')}`)
    const pulumi = execa('pulumi', pulumiArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    })
    try {
        await pulumi
    } catch {
        return { success: false }
    }

    return {
        success: true,
    }
}

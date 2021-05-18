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
    const infrastructureRoot =
        context.workspace.projects[`${context.projectName}-infrastructure`].root

    console.log(
        `> nx run ${options.targetProjectName}:${
            options.buildTarget ?? 'build'
        }:production`,
    )
    // Build project to be deployed
    for await (const s of await runExecutor(
        {
            project: options.targetProjectName,
            target: options.buildTarget ?? 'build',
            configuration: 'production',
        },
        {},
        context,
    )) {
        if (!s.success) {
            return {
                success: false,
            }
        }
    }

    for (const additionalBuildTarget of options.additionalBuildTargets || []) {
        console.log(
            `> nx run ${additionalBuildTarget.project}:${
                additionalBuildTarget.target
            }${
                additionalBuildTarget.configuration
                    ? `:${additionalBuildTarget}`
                    : ''
            }`,
        )
        for await (const s of await runExecutor(
            additionalBuildTarget,
            {},
            {
                ...context,
                configurationName: additionalBuildTarget.configuration,
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

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

    const infrastructureProject =
        options.infrastructureProject ?? context.projectName

    const infrastructureRoot =
        context.workspace.projects[infrastructureProject]?.root

    if (!infrastructureRoot) {
        console.error(
            'Error: infrastructureRoot not found. Set it in workspace.json.',
        )
        return {
            success: false,
        }
    }

    if (options.targetProjectName) {
        console.log(
            `> nx run ${options.targetProjectName}:${
                options.buildTarget ?? 'build'
            }:production`,
        )
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
    }

    for (const buildTarget of options.buildTargets ??
        options.additionalBuildTargets ??
        []) {
        console.log(
            `> nx run ${buildTarget.project}:${buildTarget.target}${
                buildTarget.configuration ? `:${buildTarget.configuration}` : ''
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

    const commandLineMap: Record<string, string> = {
        '--disableIntegrityChecking': '--disable-integrity-checking',
        '--nonInteractive': '--non-interactive',
        '--targetDependents': '--target-dependents',
        '--targetReplace': '--target-replace',
    }

    let env: string | undefined

    // NX Mangles command line args. Let's fix them back.
    // https://github.com/nrwl/nx/issues/5710
    // This is an incomplete list, should do all args
    const pulumiArguments = process.argv
        .slice(4)
        .map((arg) => {
            const mangled = Object.keys(commandLineMap).find((mangled) =>
                arg.startsWith(mangled),
            )
            if (mangled) {
                return arg.replace(mangled, commandLineMap[mangled])
            }
            return arg
        })
        .filter((arg) => {
            if (arg.startsWith('--env')) {
                env = arg.replace('--env=', '')
                return false
            }
            if (arg.startsWith('--environment')) {
                env = arg.replace('--environment=', '')
                return false
            }
            return true
        })

    const stackFormat =
        options.configurationStackFormat || '[projectName].[environment]'
    const pulumiProjectName: string = (
        yaml.load(
            fs
                .readFileSync(path.join(infrastructureRoot, 'Pulumi.yaml'))
                .toString(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any
    ).name
    const stackFromConfiguration =
        env && !pulumiArguments.includes('--stack')
            ? [
                  '--stack',
                  stackFormat
                      .replace('[projectName]', pulumiProjectName)
                      .replace('[environment]', env),
              ]
            : []
    const pulumiArgs = [
        'up',
        '--cwd',
        infrastructureRoot,
        ...pulumiArguments,
        ...stackFromConfiguration,
    ]

    // Don't fail if using --env and that stack doesn't exist
    if (env) {
        if (
            !fs.existsSync(
                path.join(
                    infrastructureRoot,
                    `Pulumi.${pulumiProjectName}.${env}.yaml`,
                ),
            )
        ) {
            console.warn(
                `${
                    context.projectName || 'unknown project'
                } skipped due to no stack configuration matching --env convention`,
            )

            return {
                success: true,
            }
        }
    }

    console.log(`> pulumi ${pulumiArgs.join(' ')}`)
    const pulumi = execa('pulumi', pulumiArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    })
    try {
        const res = await pulumi
        if (res.exitCode !== 0) {
            return { success: false }
        }
    } catch {
        return { success: false }
    }

    return {
        success: true,
    }
}

import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { BuildExecutorSchema } from './schema'
import execa from 'execa'

export default async function runUpExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const infrastructureRoot =
        context.workspace.projects[`${context.projectName}-infrastructure`].root

    console.log(`> nx run ${options.targetProjectName}:build:production`)
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
        for await (const s of await runExecutor(
            additionalBuildTarget,
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

    const pulumiArgs = [
        'up',
        '--cwd',
        infrastructureRoot,
        ...process.argv.slice(4),
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

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
        context.workspace.projects[context.projectName].root

    console.log(`Building ${options.targetProjectName}`)
    // Build project to be deployed
    for await (const s of await runExecutor(
        {
            project: options.targetProjectName,
            target: 'build',
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

    const pulumi = execa(
        'pulumi',
        ['up', '--cwd', infrastructureRoot, ...process.argv.slice(4)],
        {
            stdio: [process.stdin, process.stdout, process.stderr],
        },
    )
    try {
        await pulumi
    } catch {
        return { success: false }
    }

    return {
        success: true,
    }
}

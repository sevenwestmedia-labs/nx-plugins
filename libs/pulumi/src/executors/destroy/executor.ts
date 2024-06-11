import { ExecutorContext } from '@nx/devkit'
import execa from 'execa'
import fs from 'fs'
import { getStackInfo } from '../../helpers/get-pulumi-args'
import { DestroyExecutorSchema } from './schema'

export default async function runUpExecutor(
    options: DestroyExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }

    const infrastructureRoot =
        context.workspace?.projects[context.projectName]?.root

    if (!infrastructureRoot) {
        console.error(`Error: Cannot find root for ${context.projectName}.`)
        return {
            success: false,
        }
    }

    const { stackFile, stack } = getStackInfo(
        infrastructureRoot,
        options.environment,
        options.stack,
        options.configurationStackFormat,
    )

    // Don't fail if using --env and that stack doesn't exist
    if (options.environment && !fs.existsSync(stackFile)) {
        console.warn(
            `${
                context.projectName || 'unknown project'
            } skipped due to no stack configuration matching --env convention`,
        )

        return {
            success: true,
        }
    }

    const pulumiArgs = [
        'destroy',
        '--cwd',
        infrastructureRoot,
        ...(options.yes ? ['--yes'] : []),
        '--stack',
        stack,
        ...(options.skipPreview ? ['--skip-preview'] : []),
        ...(options.nonInteractive ? ['--non-interactive'] : []),
        ...(options.secretsProvider
            ? ['--secrets-provider', options.secretsProvider]
            : []),
        ...(options.disableIntegrityChecking
            ? ['--disable-integrity-check']
            : []),
        ...(options.refresh ? ['--refresh'] : []),
    ]

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

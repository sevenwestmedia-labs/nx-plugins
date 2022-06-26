import { readProjectConfiguration, Tree } from '@nrwl/devkit'
import execa from 'execa'
import { getStackInfo } from '../../helpers/get-pulumi-args'
import { CreateStackGeneratorSchema } from './schema'

export default async function (
    tree: Tree,
    options: CreateStackGeneratorSchema,
) {
    if (!options.projectName) {
        throw new Error('No projectName')
    }

    const targetProjectConfig = readProjectConfiguration(
        tree,
        options.projectName,
    )

    const { stack } = getStackInfo(
        targetProjectConfig.root,
        options.environment,
        options.stack,
        options.configurationStackFormat,
    )

    const pulumiArgs = [
        'stack',
        'init',
        '--stack',
        stack,
        '--cwd',
        targetProjectConfig.root,
        ...(options.secretsProvider
            ? ['--secrets-provider', options.secretsProvider]
            : []),
    ]

    console.log(`> pulumi ${pulumiArgs.join(' ')}`)

    return async () => {
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
    }
}

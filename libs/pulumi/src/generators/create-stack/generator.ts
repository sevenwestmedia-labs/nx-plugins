import { readProjectConfiguration, Tree } from '@nrwl/devkit'
import execa from 'execa'
import { getPulumiArgs } from '../../helpers/get-pulumi-args'
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

    const { pulumiArguments } = getPulumiArgs(
        targetProjectConfig.root,
        options.configurationStackFormat,
    )

    const pulumiArgs = ['stack', 'init', ...pulumiArguments]

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
}

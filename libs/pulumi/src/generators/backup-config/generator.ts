import { S3 } from '@aws-sdk/client-s3'
import { readProjectConfiguration, Tree } from '@nrwl/devkit'
import { getPulumiArgs } from '../../helpers/get-pulumi-args'
import { BackupConfigGeneratorSchema } from './schema'

const s3 = new S3({})

export default async function (
    tree: Tree,
    options: BackupConfigGeneratorSchema,
) {
    if (!options.projectName) {
        throw new Error('No projectName')
    }

    const targetProjectConfig = readProjectConfiguration(
        tree,
        options.projectName,
    )

    const { backendUrl, stack, stackFile } = getPulumiArgs(
        targetProjectConfig.root,
        options.configurationStackFormat,
    )

    if (backendUrl && backendUrl.startsWith('s3')) {
        const Bucket = backendUrl.replace('s3://', '')
        console.log(
            `Uploading ${stack} config to ${backendUrl}/.pulumi/config-backups/${stack}`,
        )
        await s3.putObject({
            Bucket,
            Key: `.pulumi/config-backups/${stack}`,
            Body: tree.read(stackFile)?.toString(),
        })
    } else {
        console.error('This generator only supports s3 backends currently')
    }
}

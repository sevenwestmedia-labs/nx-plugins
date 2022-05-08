import { S3 } from '@aws-sdk/client-s3'
import { readProjectConfiguration, Tree } from '@nrwl/devkit'
import { getStackInfo } from '../../helpers/get-pulumi-args'
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

    const { backendUrl, stack, stackFile } = getStackInfo(
        targetProjectConfig.root,
        options.environment,
        options.stack,
        options.configurationStackFormat,
    )

    if (backendUrl && backendUrl.startsWith('s3')) {
        const Bucket = backendUrl.replace('s3://', '')
        console.log(
            `Restoring ${stack} config from ${backendUrl}/.pulumi/config-backups/${stack}`,
        )
        const response = await s3.getObject({
            Bucket,
            Key: `.pulumi/config-backups/${stack}`,
        })

        if (response.Body) {
            tree.write(stackFile, response.Body.toString())
        }
    } else {
        console.error('This generator only supports s3 backends currently')
    }
}

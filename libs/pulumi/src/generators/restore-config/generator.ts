import { readProjectConfiguration, Tree } from '@nrwl/devkit'
import { Readable } from 'node:stream'
import { getStackInfo } from '../../helpers/get-pulumi-args'
import { BackupConfigGeneratorSchema } from './schema'

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
        const { S3 } = await import('@aws-sdk/client-s3')
        const s3 = new S3({})
        const Bucket = backendUrl.replace('s3://', '')
        console.log(
            `Restoring ${stack} config from ${backendUrl}/.pulumi/config-backups/${stack}`,
        )
        const response = await s3.getObject({
            Bucket,
            Key: `.pulumi/config-backups/${stack}`,
        })

        if (response.Body) {
            tree.write(
                stackFile,
                await streamToString(response.Body as Readable),
            )
        }
    } else {
        console.error('This generator only supports s3 backends currently')
    }
}

async function streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    })
}

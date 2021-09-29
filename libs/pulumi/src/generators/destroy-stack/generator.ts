import { readProjectConfiguration, Tree } from '@nrwl/devkit'
import S3 from 'aws-sdk/clients/s3'
import execa from 'execa'
import { getPulumiArgs } from '../../helpers/get-pulumi-args'
import { CreateStackGeneratorSchema } from './schema'

const s3 = new S3({})

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

    const { pulumiArguments, backendUrl, stack } = getPulumiArgs(
        targetProjectConfig.root,
        options.configurationStackFormat,
    )

    // Currently only support S3 locks
    if (options.removeLock && backendUrl && backendUrl.startsWith('s3')) {
        const Bucket = backendUrl.replace('s3://', '')
        const locksResponse = await s3
            .listObjectsV2({
                Bucket,
                Prefix: `.pulumi/locks/${stack}`,
            })
            .promise()

        for (const lockObject of locksResponse.Contents || []) {
            console.log(`Deleting ${lockObject}`)
            await s3
                .deleteObject({
                    Bucket,
                    Key: `${lockObject.Key}`,
                })
                .promise()
        }
    }

    if (options.removePendingOperations) {
        const pulumiExportArgs = [
            'stack',
            'export',
            '--file',
            './state.json',
            ...pulumiArguments,
        ]
        console.log(`> pulumi ${pulumiExportArgs.join(' ')}`)
        await execa('pulumi', pulumiExportArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })

        const pulumiImportArgs = [
            'stack',
            'import',
            '--file',
            './state.json',
            ...pulumiArguments,
        ]
        console.log(`> pulumi ${pulumiImportArgs.join(' ')}`)
        await execa('pulumi', pulumiImportArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })

        tree.delete('./state.json')
    }

    if (options.refreshBeforeDestroy) {
        const pulumiArgs = ['refresh', ...pulumiArguments]
        console.log(`> pulumi ${pulumiArgs.join(' ')}`)
        await execa('pulumi', pulumiArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })
    }

    const pulumiArgs = ['destroy', ...pulumiArguments]

    console.log(`> pulumi ${pulumiArgs.join(' ')}`)
    await execa('pulumi', pulumiArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    })

    if (options.removeStack && backendUrl && backendUrl.startsWith('s3')) {
        const Bucket = backendUrl.replace('s3://', '')
        console.log(`Deleting ${backendUrl}/.pulumi/config-backups/${stack}`)
        await s3
            .deleteObject({
                Bucket,
                Key: `.pulumi/config-backups/${stack}`,
            })
            .promise()
    }
}

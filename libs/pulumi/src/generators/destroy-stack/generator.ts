import { readProjectConfiguration, Tree, updateJson } from '@nrwl/devkit'
import S3 from 'aws-sdk/clients/s3'
import execa from 'execa'
import path from 'path'
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
        const stateFile = `${targetProjectConfig.root}/${stack}-state.json`

        const pulumiExportArgs = [
            'stack',
            'export',
            '--file',
            path.basename(stateFile),
            // need to filter out --yes since export/import doesn't like it
            ...pulumiArguments.filter((arg) => arg !== '--yes'),
        ]
        console.log(`> pulumi ${pulumiExportArgs.join(' ')}`)
        await execa('pulumi', pulumiExportArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })

        // remove the pending operations from the state
        updateJson(tree, stateFile, (state) => {
            if (
                !options.ignorePendingCreateOperations &&
                state.deployment.pending_operations
            ) {
                const createOperations =
                    state.deployment.pending_operations.filter(
                        (operation: { resource: string; type: string }) =>
                            operation.type === 'creating',
                    )
                if (createOperations.length > 0) {
                    tree.delete(stateFile)
                    console.error(createOperations)
                    throw new Error(
                        'There are pending create operations. Please remove them before destroying the stack',
                    )
                }
            }
            delete state.deployment.pending_operations
            return state
        })

        const pulumiImportArgs = [
            'stack',
            'import',
            '--file',
            path.basename(stateFile),
            // need to filter out --yes since export/import doesn't like it
            ...pulumiArguments.filter((arg) => arg !== '--yes'),
        ]
        console.log(`> pulumi ${pulumiImportArgs.join(' ')}`)
        await execa('pulumi', pulumiImportArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })

        tree.delete(stateFile)
    }

    if (options.refreshBeforeDestroy) {
        const pulumiRefreshArgs = ['refresh', ...pulumiArguments]
        console.log(`> pulumi ${pulumiRefreshArgs.join(' ')}`)
        await execa('pulumi', pulumiRefreshArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })
    }

    // delete the resources in the stack
    const pulumiDestroyArgs = ['destroy', ...pulumiArguments]
    console.log(`> pulumi ${pulumiDestroyArgs.join(' ')}`)
    await execa('pulumi', pulumiDestroyArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    })

    if (options.removeStack) {
        // remove the stack
        const pulumiRemoveArgs = ['stack', 'rm', ...pulumiArguments]
        console.log(`> pulumi ${pulumiRemoveArgs.join(' ')}`)
        await execa('pulumi', pulumiRemoveArgs, {
            stdio: [process.stdin, process.stdout, process.stderr],
        })

        // remove the config
        if (backendUrl && backendUrl.startsWith('s3://')) {
            const Bucket = backendUrl.replace('s3://', '')
            console.log(
                `Deleting ${backendUrl}/.pulumi/config-backups/${stack}`,
            )
            await s3
                .deleteObject({
                    Bucket,
                    Key: `.pulumi/config-backups/${stack}`,
                })
                .promise()
        }
    }
}

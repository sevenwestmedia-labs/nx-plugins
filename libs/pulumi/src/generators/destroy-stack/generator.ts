import { S3 } from '@aws-sdk/client-s3'
import { readProjectConfiguration, Tree, updateJson } from '@nrwl/devkit'
import path from 'path'
import { getStackInfo } from '../../helpers/get-pulumi-args'
import { execPulumi } from '../../helpers/exec-pulumi';
import { DestroyStackGeneratorSchema } from './schema'

const s3 = new S3({})

export default async function (
    tree: Tree,
    options: DestroyStackGeneratorSchema,
) {
    if (!options.projectName) {
        throw new Error('No projectName')
    }

    const targetProjectConfig = readProjectConfiguration(
        tree,
        options.projectName,
    )

    const { backendUrl, stack } = getStackInfo(
        targetProjectConfig.root,
        options.environment,
        options.stack,
        options.configurationStackFormat,
    )

    // Currently only support S3 locks
    if (options.removeLock && backendUrl && backendUrl.startsWith('s3')) {
        const Bucket = backendUrl.replace('s3://', '')
        const locksResponse = await s3.listObjectsV2({
            Bucket,
            Prefix: `.pulumi/locks/${stack}`,
        })

        for (const lockObject of locksResponse.Contents || []) {
            console.log(`Deleting ${lockObject}`)
            await s3.deleteObject({
                Bucket,
                Key: `${lockObject.Key}`,
            })
        }
    }

    if (options.removePendingOperations) {
        const stateFile = `${targetProjectConfig.root}/${stack}-state.json`

        const pulumiExportArgs: string[] = [
            'stack',
            'export',
            '--stack',

            '--file',
            path.basename(stateFile),
        ]
        await execPulumi(pulumiExportArgs);

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

        const pulumiImportArgs: string[] = [
            'stack',
            'import',
            '--stack', stack,
            '--cwd', targetProjectConfig.root,
            '--file',
            path.basename(stateFile),
        ]
        await execPulumi(pulumiImportArgs);

        tree.delete(stateFile)
    }

    if (options.refreshBeforeDestroy) {
        const pulumiRefreshArgs: string[] = [
            'refresh',
            '--stack', stack,
            '--cwd', targetProjectConfig.root,
            ...(options.target
                ? options.target.map((target) => `--target=${target}`)
                : []),
        ]
        await execPulumi(pulumiRefreshArgs);
    }

    // delete the resources in the stack
    const pulumiDestroyArgs: string[] = [
        'destroy',
        '--stack', stack,
        '--cwd', targetProjectConfig.root,
        ...(options.target
            ? options.target.map((target) => `--target=${target}`)
            : []),
        ...(options.yes ? ['--yes'] : []),
        ...(options.skipPreview ? ['--skip-preview'] : []),
    ]
    await execPulumi(pulumiDestroyArgs);

    if (options.removeStack) {
        // remove the stack
        const pulumiRemoveArgs: string[] = [
            'stack',
            'rm',
            '--stack', stack,
            '--cwd', targetProjectConfig.root,
            ...(options.yes ? ['--yes'] : []),
        ]
        await execPulumi(pulumiRemoveArgs);

        // remove the config
        if (backendUrl && backendUrl.startsWith('s3://')) {
            const Bucket = backendUrl.replace('s3://', '')
            console.log(
                `Deleting ${backendUrl}/.pulumi/config-backups/${stack}`,
            )
            await s3.deleteObject({
                Bucket,
                Key: `.pulumi/config-backups/${stack}`,
            })
        }
    }
}

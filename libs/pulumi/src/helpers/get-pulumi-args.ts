import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export function getStackInfo(
    root: string,
    environmentArg: string | undefined,
    stackArg: string | undefined,
    stackFormat = '[projectName].[environment]',
): {
    pulumiProjectName: string
    stack: string
    pulumiConfigFolder: string | undefined
    stackFile: string
    backendUrl: string | undefined
} {
    const configFile = yaml.load(
        fs.readFileSync(path.join(root, 'Pulumi.yaml')).toString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any
    const pulumiProjectName: string = configFile.name
    const pulumiConfigFolder: string | undefined = configFile.config
    const backendUrl: string | undefined = configFile.backend?.url

    let stack: string | undefined
    if (environmentArg && !stackArg) {
        stack = stackFormat
            .replace('[projectName]', pulumiProjectName)
            .replace('[environment]', environmentArg)
    } else {
        stack = stackArg
    }
    if (!stack) {
        throw new Error(
            'No stack name provided, use --env or --stack to provide stack name',
        )
    }

    const stackFile = path.join(
        ...[root, pulumiConfigFolder, `Pulumi.${stack}.yaml`].filter(
            (x): x is string => !!x,
        ),
    )

    return {
        pulumiProjectName,
        pulumiConfigFolder,
        stackFile,
        backendUrl,
        stack,
    }
}

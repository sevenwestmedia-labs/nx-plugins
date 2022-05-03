export interface BuildExecutorSchema {
    configurationStackFormat?: string
    buildTargets?: Array<{
        project: string
        target: string
        configuration?: string
    }>
    yes?: boolean
    disableIntegrityChecking?: boolean
    nonInteractive?: boolean
    secretsProvider?: string
}

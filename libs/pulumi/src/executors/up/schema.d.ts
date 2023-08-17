export interface UpExecutorSchema {
    configurationStackFormat?: string
    buildTargets?: Array<{
        project: string
        target: string
        configuration?: string
    }>
    yes?: boolean
    disableIntegrityChecking?: boolean
    skipPreview?: boolean
    nonInteractive?: boolean
    secretsProvider?: string
    environment?: string
    stack?: string
    refresh?: boolean
    envVars?: string[]
}

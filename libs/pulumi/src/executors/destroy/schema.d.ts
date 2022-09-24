export interface DestroyExecutorSchema {
    configurationStackFormat?: string
    yes?: boolean
    disableIntegrityChecking?: boolean
    skipPreview?: boolean
    nonInteractive?: boolean
    secretsProvider?: string
    environment?: string
    stack?: string
    refresh?: boolean
}

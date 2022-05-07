export interface BackupConfigGeneratorSchema {
    projectName: string
    environment?: string
    stack?: string
    configurationStackFormat?: string
}

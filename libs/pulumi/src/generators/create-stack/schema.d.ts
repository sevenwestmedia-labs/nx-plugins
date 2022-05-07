export interface CreateStackGeneratorSchema {
    projectName: string
    environment?: string
    stack?: string
    configurationStackFormat?: string
    secretsProvider?: string
}

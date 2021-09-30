export interface CreateStackGeneratorSchema {
    projectName: string
    env: string
    configurationStackFormat?: string
    secretsProvider?: string
}

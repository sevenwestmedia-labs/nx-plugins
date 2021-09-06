export interface BuildExecutorSchema {
    configurationStackFormat?: string
    buildTargets?: Array<{
        project: string
        target: string
        configuration?: string
    }>
}

export interface BuildExecutorSchema {
    targetProjectName: string
    buildTarget?: string
    additionalBuildTargets?: Array<{
        project: string
        target: string
        configuration: string
    }>
}

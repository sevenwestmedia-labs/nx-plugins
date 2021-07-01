export interface BuildTarget {
    project: string
    target: string
    configuration?: string
}

export interface BuildExecutorSchema {
    targetProjectName: string
    configurationStackFormat?: string
    infrastructureProject?: string
    buildTargets?: Array<BuildTarget>

    /**
     * @deprecated use buildTargets instead
     */
    buildTarget?: string

    /**
     * @deprecated use buildTargets instead
     */
    additionalBuildTargets?: Array<BuildTarget>
}

export interface CreateStackGeneratorSchema {
    projectName: string
    env: string
    configurationStackFormat?: string

    removeLock?: boolean
    removeStack?: boolean
    removePendingOperations?: boolean
    refreshBeforeDestroy?: boolean
}

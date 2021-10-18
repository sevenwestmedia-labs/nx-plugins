export interface CreateStackGeneratorSchema {
    projectName: string
    env: string
    configurationStackFormat?: string

    ignorePendingCreateOperations?: boolean
    removeLock?: boolean
    removeStack?: boolean
    removePendingOperations?: boolean
    refreshBeforeDestroy?: boolean
}

export interface CreateStackGeneratorSchema {
    projectName: string
    environment?: string
    stack?: string
    configurationStackFormat?: string

    target?: string[]

    ignorePendingCreateOperations?: boolean
    removeLock?: boolean
    removeStack?: boolean
    removePendingOperations?: boolean
    refreshBeforeDestroy?: boolean
}

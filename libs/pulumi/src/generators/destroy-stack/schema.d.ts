export interface DestroyStackGeneratorSchema {
    projectName: string
    environment?: string
    stack?: string
    configurationStackFormat?: string

    target?: string[]

    yes?: boolean
    skipPreview?: boolean
    ignorePendingCreateOperations?: boolean
    removeLock?: boolean
    removeStack?: boolean
    removePendingOperations?: boolean
    refreshBeforeDestroy?: boolean
}

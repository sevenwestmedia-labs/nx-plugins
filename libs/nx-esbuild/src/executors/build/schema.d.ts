export interface BuildExecutorSchema {
    platform?: string
    target?: string
    externals?: string[]
    entry?: string
    outfile?: string
}

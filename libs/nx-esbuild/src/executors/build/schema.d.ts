export interface BuildExecutorSchema {
    platform?: string
    target?: string
    externals?: string[]
    entry?: string
    entries?: string[]
    outfile?: string
    outdir?: string
}

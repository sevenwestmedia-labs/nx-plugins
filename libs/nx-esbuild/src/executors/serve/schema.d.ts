import { BuildOptions } from 'esbuild'

export interface ServeExecutorSchema extends Omit<BuildOptions, 'plugins'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: Array<{ package: string; args: any }>
    serveCommand?: string
    serveCommandCwd?: string
}

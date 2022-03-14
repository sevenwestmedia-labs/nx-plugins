import { BuildExecutorSchema } from '../build/schema'

export interface PackageExecutorSchema extends BuildExecutorSchema {
    beforeZip?: string
}

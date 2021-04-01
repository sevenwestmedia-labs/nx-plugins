export interface PackageExecutorSchema {
    main: string
    tsConfig: string
    sourceMap: boolean
    packageJson: string
    updateBuildableProjectDepsInPackageJson?: boolean
    buildableProjectDepsInPackageJsonType?: 'dependencies' | 'peerDependencies'
}

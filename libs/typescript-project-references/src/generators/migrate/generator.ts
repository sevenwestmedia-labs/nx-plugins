import {
    formatFiles,
    getProjects,
    offsetFromRoot,
    ProjectConfiguration,
    ProjectGraph,
    Tree,
    updateJson,
    writeJson,
} from '@nx/devkit'
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph'
import { MigrateSchema } from './schema'

export default async function (host: Tree, _options: MigrateSchema) {
    writeJson(host, `./tsconfig.json`, {
        files: [],
        compilerOptions: {
            disableSourceOfProjectReferenceRedirect: true,
        },
        references: [],
    })
    if (!host.exists(`./tsconfig.settings.json`)) {
        writeJson(host, `./tsconfig.settings.json`, {
            extends: './tsconfig.base.json',
            compilerOptions: {
                declaration: true,
                noEmit: false,
                composite: true,
                incremental: true,
            },
            exclude: ['node_modules', 'tmp'],
        })
    }

    const projects = getProjects(host)
    const graph = await createProjectGraphAsync()

    projects.forEach((project, name) =>
        migrateProject(host, name, project, graph, projects),
    )
    await formatFiles(host)
}

function migrateProject(
    host: Tree,
    name: string,
    project: ProjectConfiguration,
    graph: ProjectGraph,
    projects: Map<string, ProjectConfiguration>,
) {
    if (host.exists(`${project.root}/.eslintrc.json`)) {
        updateJson(host, `${project.root}/.eslintrc.json`, (eslint) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(eslint.overrides || []).forEach((override: any) => {
                // Type checking in linting is super slow
                delete override.parserOptions
            })
            return eslint
        })
    }

    if (project.projectType === 'library') {
        host.delete(`${project.root}/tsconfig.lib.json`)
    }
    if (project.projectType === 'application') {
        host.delete(`${project.root}/tsconfig.app.json`)
    }

    host.delete(`${project.root}/tsconfig.spec.json`)
    createTypeScriptConfig(host, name, project, projects, graph)
    createOrUpdateLibProjectPackageJson(host, project, name)

    // Add into root typescript project references config
    updateJson(host, `./tsconfig.json`, (tsconfig) => {
        if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !tsconfig.references.some((ref: any) => ref.path === project.root)
        ) {
            tsconfig.references.push({
                path: `./${project.root}`,
            })
        }

        return tsconfig
    })
}

function createTypeScriptConfig(
    host: Tree,
    name: string,
    project: ProjectConfiguration,
    projects: Map<string, ProjectConfiguration>,
    graph: ProjectGraph,
) {
    const tsConfigPath = `./${project.root}/tsconfig.json`
    const graphDependencies = graph.dependencies[name]
    const typescriptReferences =
        graphDependencies
            ?.map(
                (dep) =>
                    projects.get(dep.target) && {
                        path: `${offsetFromRoot(project.root)}${
                            projects.get(dep.target)?.root
                        }`,
                    },
            )
            ?.filter((ref) => !!ref) || []

    if (host.exists(tsConfigPath)) {
        updateJson(host, tsConfigPath, (tsConfig) => {
            if (tsConfig.files && tsConfig.files.length === 0) {
                delete tsConfig.files
            }
            if (tsConfig.include && tsConfig.include.length === 0) {
                delete tsConfig.include
            }

            tsConfig.extends = `${offsetFromRoot(
                project.root,
            )}tsconfig.settings.json`
            tsConfig.compilerOptions = tsConfig.compilerOptions || {}
            tsConfig.compilerOptions.outDir = './out-tsc'
            tsConfig.compilerOptions.rootDir = './src'
            if (!tsConfig.include) {
                tsConfig.include = ['src/**/*.ts', 'src/**/*.tsx']
            }
            tsConfig.references = typescriptReferences

            return tsConfig
        })
    } else {
        writeJson(host, tsConfigPath, {
            extends: `${offsetFromRoot(project.root)}tsconfig.settings.json`,
            compilerOptions: {
                outDir: './out-tsc',
                rootDir: './src',
                types: ['node'],
            },
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            references: typescriptReferences,
        })
    }
}

function createOrUpdateLibProjectPackageJson(
    host: Tree,
    project: ProjectConfiguration,
    name: string,
) {
    // Only projects can be referenced, don't mess with applications
    if (project.projectType !== 'library') {
        return
    }

    if (host.exists(`${project.root}/package.json`)) {
        updateJson(host, `${project.root}/package.json`, (value) => {
            value.main = 'out-tsc/index.js'

            return value
        })
    } else {
        writeJson(host, `${project.root}/package.json`, {
            name,
            private: true,
            version: '0.0.1',
            main: 'out-tsc/index.js',
        })
    }
}

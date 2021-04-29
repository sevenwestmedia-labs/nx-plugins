import {
    formatFiles,
    getProjects,
    NxJsonProjectConfiguration,
    offsetFromRoot,
    ProjectConfiguration,
    ProjectGraph,
    Tree,
    updateJson,
    writeJson,
} from '@nrwl/devkit'
import { MigrateSchema } from './schema'
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph'

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
    const graph = createProjectGraph()

    projects.forEach((project, name) =>
        migrateProject(host, name, project, graph, projects),
    )
    await formatFiles(host)
}

function migrateProject(
    host: Tree,
    name: string,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
    graph: ProjectGraph,
    projects: Map<string, ProjectConfiguration & NxJsonProjectConfiguration>,
) {
    host.write(
        `${project.root}/jest.config.js`,
        `module.exports = {
displayName: '${name}',
preset: '../../jest.preset.js',
coverageDirectory: '../../coverage/${project.root}',
}`,
    )

    host.write(
        'jest.preset.js',
        `const { compilerOptions } = require('./tsconfig.base');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'html'],
    coverageReporters: ['html'],
    transform: {
        '^.+\\.(tsx?|jsx?|html)$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/tsc-out/'],
    modulePathIgnorePatterns: ['/dist/', '/tsc-out/'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: __dirname } )
};`,
    )

    if (!host.exists('babel.config.json')) {
        host.write(
            'babel.config.json',
            `{
    "presets": ["@babel/preset-env", "@babel/preset-typescript"],
    "babelrcRoots": ["*"]
}
`,
        )
    }

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
    // NOTE This means we cannot use @nrwl/jest resolver, we have to use typescript -> jest path mapping instead
    host.delete(`${project.root}/tsconfig.spec.json`)
    fixBabelrc(host, project)
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
    project: ProjectConfiguration & NxJsonProjectConfiguration,
    projects: Map<string, ProjectConfiguration & NxJsonProjectConfiguration>,
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
            tsConfig.compilerOptions.outDir = './tsc-out'
            tsConfig.compilerOptions.rootDir = './src'
            if (!tsConfig.compilerOptions.types?.includes('jest')) {
                tsConfig.compilerOptions.types?.push('jest')
            }
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
                outDir: './tsc-out',
                rootDir: './src',
                types: ['jest', 'node'],
            },
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            references: typescriptReferences,
        })
    }
}

function createOrUpdateLibProjectPackageJson(
    host: Tree,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
    name: string,
) {
    // Only projects can be referenced, don't mess with applications
    if (project.projectType !== 'library') {
        return
    }

    if (host.exists(`${project.root}/package.json`)) {
        updateJson(host, `${project.root}/package.json`, (value) => {
            value.main = 'tsc-out/index.js'

            return value
        })
    } else {
        writeJson(host, `${project.root}/package.json`, {
            name,
            private: true,
            version: '0.0.1',
            main: 'tsc-out/index.js',
        })
    }
}

function fixBabelrc(
    host: Tree,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
) {
    const babelRc = `${project.root}/.babelrc`
    if (host.exists(babelRc)) {
        updateJson(host, babelRc, (value) => {
            // The @nrwl projects comes with too many assumptions, we need to
            // drop back to basics
            value.presets = (value.presets || []).filter(
                (preset: string) =>
                    preset !== '@nrwl/web/babel' &&
                    preset[0] !== '@nrwl/web/babel',
            )
            if (!value.presets.includes('@babel/preset-typescript')) {
                value.presets.splice(0, 0, '@babel/preset-typescript')
            }
            if (!value.presets.includes('@babel/preset-env')) {
                value.presets.splice(0, 0, '@babel/preset-env')
            }

            return value
        })
    }
}

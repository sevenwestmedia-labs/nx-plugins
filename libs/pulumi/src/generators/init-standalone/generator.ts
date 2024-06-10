import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    names,
    offsetFromRoot,
    Tree,
    updateJson,
} from '@nx/devkit'
import * as path from 'path'
import { PulumiGeneratorSchema } from './schema'

interface NormalizedSchema extends PulumiGeneratorSchema {
    projectName: string
    projectRoot: string
    projectDirectory: string
    parsedTags: string[]
}

function normalizeOptions(
    host: Tree,
    options: PulumiGeneratorSchema,
): NormalizedSchema {
    const name = names(options.name).fileName
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : `${getWorkspaceLayout(host).appsDir}/${name}`
    const projectName = name.replace(new RegExp('/', 'g'), '-')
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : []

    return {
        ...options,
        projectName,
        projectRoot: projectDirectory,
        projectDirectory,
        parsedTags,
    }
}

function addFiles(host: Tree, options: NormalizedSchema) {
    const templateOptions = {
        ...options,
        ...names(options.name),
        projectName: options.name,
        packageName: options.projectName,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        template: '',
    }
    generateFiles(
        host,
        path.join(__dirname, 'files'),
        options.projectRoot,
        templateOptions,
    )
}

export default async function (host: Tree, options: PulumiGeneratorSchema) {
    const normalizedOptions = normalizeOptions(host, options)
    addProjectConfiguration(host, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'application',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        targets: {
            lint: {
                executor: '@nx/eslint:lint',
                options: {
                    lintFilePatterns: [
                        `${normalizedOptions.projectRoot}/**/*.ts`,
                    ],
                },
            },
            test: {
                executor: 'nx:run-commands',
                options: {
                    command: 'npx vitest --run',
                    cwd: `libs/${normalizedOptions.projectRoot}`,
                },
            },
            up: {
                executor: '@wanews/nx-pulumi:up',
                options: {
                    buildTargets: [],
                },
            },
            refresh: {
                executor: '@wanews/nx-pulumi:refresh',
                options: {
                    buildTargets: [],
                },
            },
            destroy: {
                executor: '@wanews/nx-pulumi:destroy',
                options: {
                    buildTargets: [],
                },
            },
        },
        tags: normalizedOptions.parsedTags,
    })

    addFiles(host, normalizedOptions)

    if (host.exists('tsconfig.json')) {
        updateJson(host, 'tsconfig.json', (tsconfig) => {
            if (tsconfig.references) {
                tsconfig.references.push({
                    path: `./${normalizedOptions.projectRoot}`,
                })

                tsconfig.references.sort(
                    (a: { path: string }, b: { path: string }) =>
                        a.path.localeCompare(b.path),
                )
            }

            return tsconfig
        })
    }

    await formatFiles(host)
}

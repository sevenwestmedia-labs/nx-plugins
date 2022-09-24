import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    names,
    offsetFromRoot,
    TargetConfiguration,
    Tree,
    updateJson,
} from '@nrwl/devkit'
import * as path from 'path'
import { LibraryGeneratorSchema } from './schema'

interface NormalizedSchema extends LibraryGeneratorSchema {
    projectName: string
    projectRoot: string
    projectDirectory: string
    parsedTags: string[]
}

function normalizeOptions(
    host: Tree,
    options: LibraryGeneratorSchema,
): NormalizedSchema {
    const name = names(options.name).fileName
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : `${getWorkspaceLayout(host).libsDir}/${name}`
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
        packageName: options.packageName ?? options.name,
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

export default async function (host: Tree, options: LibraryGeneratorSchema) {
    const normalizedOptions = normalizeOptions(host, options)
    const defaultTargets: {
        [targetName: string]: TargetConfiguration
    } = {
        lint: {
            executor: '@nrwl/linter:eslint',
            options: {
                lintFilePatterns: [`${normalizedOptions.projectRoot}/**/*.ts`],
            },
        },
        test: {
            executor: 'nx:run-commands',
            options: {
                command: 'npx vitest --run',
                cwd: `libs/${normalizedOptions.projectRoot}`,
            },
        },
    }
    addProjectConfiguration(host, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        targets: options.package
            ? {
                  ...defaultTargets,
                  package: {
                      executor:
                          '@wanews/nx-typescript-project-references:package',
                      options: {
                          main: `${normalizedOptions.projectRoot}/src/index.ts`,
                          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.json`,
                      },
                  },
              }
            : defaultTargets,
        tags: normalizedOptions.parsedTags,
    })
    addFiles(host, normalizedOptions)
    updateJson(host, 'tsconfig.base.json', (value) => {
        const existingPaths = value.compilerOptions.paths

        value.compilerOptions.paths = {
            ...existingPaths,
            [options.packageName ||
            `@${getWorkspaceLayout(host).npmScope}/${options.name}`]: [
                `${normalizedOptions.projectRoot}/src/index.ts`,
            ],
        }

        return value
    })

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

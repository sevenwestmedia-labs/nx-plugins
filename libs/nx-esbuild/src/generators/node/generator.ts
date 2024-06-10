import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    names,
    offsetFromRoot,
    Tree,
    updateJson,
    writeJson,
} from '@nx/devkit'
import * as path from 'path'
import { NodeGeneratorSchema } from './schema'

interface NormalizedSchema extends NodeGeneratorSchema {
    projectName: string
    projectRoot: string
    projectDirectory: string
    parsedTags: string[]
}

function normalizeOptions(
    host: Tree,
    options: NodeGeneratorSchema,
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

export default async function (host: Tree, options: NodeGeneratorSchema) {
    const normalizedOptions = normalizeOptions(host, options)
    addProjectConfiguration(host, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'application',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        targets: {
            build: {
                executor: '@wanews/nx-esbuild:build',
                options: {
                    platform: 'node',
                    target: 'node14',
                    outfile: `./${normalizedOptions.projectRoot}/dist/bundle.js`,
                    entryPoints: [
                        `./${normalizedOptions.projectRoot}/src/index.ts`,
                    ],
                },
            },
            package: {
                executor: '@wanews/nx-esbuild:package',
                options: {
                    platform: 'node',
                    target: 'node14',
                    outfile: `./${normalizedOptions.projectRoot}/dist/bundle.js`,
                    entryPoints: [
                        `./${normalizedOptions.projectRoot}/src/index.ts`,
                    ],
                },
            },
            serve: {
                executor: '@wanews/nx-esbuild:serve',
                options: {
                    platform: 'node',
                    target: 'node14',
                    outfile: `./${normalizedOptions.projectRoot}/dist/bundle.js`,
                    entryPoints: [
                        `./${normalizedOptions.projectRoot}/src/index.ts`,
                    ],
                },
            },
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
                    cwd: normalizedOptions.projectRoot,
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

    // Add project references config to workspace
    if (!host.exists(`tsconfig.settings.json`)) {
        writeJson(host, `tsconfig.settings.json`, {
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

    await formatFiles(host)
}

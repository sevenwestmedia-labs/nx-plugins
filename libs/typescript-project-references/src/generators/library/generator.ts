import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    names,
    offsetFromRoot,
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
        : name
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
    const projectRoot = `${
        getWorkspaceLayout(host).libsDir
    }/${projectDirectory}`
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : []

    return {
        ...options,
        projectName,
        projectRoot,
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
    addProjectConfiguration(host, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        targets: options.package
            ? {
                  package: {
                      executor:
                          '@wanews/nx-typescript-project-references:package',
                      options: {
                          main: `${normalizedOptions.projectRoot}/src/index.ts`,
                          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.json`,
                      },
                  },
              }
            : {},

        tags: normalizedOptions.parsedTags,
    })
    addFiles(host, normalizedOptions)
    updateJson(host, 'tsconfig.base.json', (value) => {
        const existingPaths = value.compilerOptions.paths

        value.compilerOptions.paths = {
            ...existingPaths,
            [options.packageName || options.name]: [
                `${normalizedOptions.projectRoot}/src/index.ts`,
            ],
        }

        return value
    })
    await formatFiles(host)
}

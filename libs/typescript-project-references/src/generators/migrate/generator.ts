import {
    getProjects,
    NxJsonProjectConfiguration,
    ProjectConfiguration,
    Tree,
    updateJson,
    writeJson,
} from '@nrwl/devkit'
import { MigrateSchema } from './schema'

export default async function (host: Tree, _options: MigrateSchema) {
    writeJson(host, `./tsconfig.json`, {
        files: [],
        compilerOptions: {
            disableSourceOfProjectReferenceRedirect: true,
        },
        references: [],
    })
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

    const projects = getProjects(host)

    projects.forEach((project, name) => migrateProject(host, project, name))
}

function migrateProject(
    host: Tree,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
    name: string,
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
        '^.+\\.(tsx?|jsx?|html)$': 'esbuild-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    modulePathIgnorePatterns: ['/dist/'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: __dirname } )
};`,
    )

    updateJson(host, `${project.root}/.eslintrc.json`, (eslint) => {
        // Type checking in linting is super slow
        delete eslint.overrides[0].parserOptions

        return eslint
    })

    host.delete(`${project.root}/tsconfig.json`)
    if (project.projectType === 'library') {
        host.delete(`${project.root}/tsconfig.lib.json`)
    }
    if (project.projectType === 'application') {
        host.delete(`${project.root}/tsconfig.app.json`)
    }
    // NOTE This means we cannot use @nrwl/jest resolver, we have to use typescript -> jest path mapping instead
    host.delete(`${project.root}/tsconfig.spec.json`)
    createTypeScriptConfig(host, project)
    createOrUpdateLibProjectPackageJson(host, project, name)

    // Add into root typescript project references config
    updateJson(host, `./tsconfig.json`, (tsconfig) => {
        if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !tsconfig.references.some((ref: any) => ref.path === project.root)
        ) {
            tsconfig.references.push({
                path: project.root,
            })
        }

        return tsconfig
    })
}

function createTypeScriptConfig(
    host: Tree,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
) {
    writeJson(host, `./${project.root}/tsconfig.json`, {
        extends: '../../tsconfig.settings.json',
        compilerOptions: {
            outDir: './dist',
            rootDir: './src',
            types: ['jest', 'node'],
        },
        include: ['src/**/*.ts', 'src/**/*.tsx'],
    })
}

function createOrUpdateLibProjectPackageJson(
    host: Tree,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
    name: string,
) {
    if (host.exists(`${project.root}/package.json`)) {
        updateJson(host, `${project.root}/package.json`, (value) => {
            value.main = 'dist/index.js'

            return value
        })
    } else {
        writeJson(host, `${project.root}/package.json`, {
            name: `${name}`,
            version: '0.0.1',
            main: 'dist/index.js',
            peerDependencies: {
                tslib: '^2.1.0',
            },
        })
    }
}

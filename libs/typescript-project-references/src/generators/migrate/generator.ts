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
    createTypeScriptConfig(host, project)

    // Add into root typescript project references config
    updateJson(host, `./tsconfig.json`, (tsconfig) => {
        tsconfig.references.push({
            path: project.root,
        })

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
            outDir: './dist/esm',
            rootDir: './src',
            types: ['jest', 'node'],
        },
        include: ['src/**/*.ts', 'src/**/*.spec.ts'],
        references: [
            {
                path: './tsconfig.cjs.json',
            },
        ],
    })
    writeJson(host, `${project.root}/tsconfig.cjs.json`, {
        extends: './tsconfig.json',
        compilerOptions: {
            outDir: './dist/cjs',
            module: 'CommonJS',
        },
    })
}

function createOrUpdateLibProjectPackageJson(
    host: Tree,
    project: ProjectConfiguration & NxJsonProjectConfiguration,
    name: string,
) {
    if (host.exists(`${project.root}/package.json`)) {
        updateJson(host, `${project.root}/package.json`, (value) => {
            value.main = 'dist/cjs/index.js'
            value.module = 'dist/esm/index.js'

            return value
        })
    } else {
        writeJson(host, `${project.root}/package.json`, {
            name: `${name}`,
            version: '0.0.1',
            main: 'dist/cjs/index.js',
            module: 'dist/esm/index.js',
            peerDependencies: {
                tslib: '^2.1.0',
            },
        })
    }
}

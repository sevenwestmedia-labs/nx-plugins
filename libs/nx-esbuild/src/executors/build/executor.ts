import { BuildExecutorSchema } from './schema'
import execa from 'execa'
import { ExecutorContext, readJson } from '@nrwl/devkit'
import { getEsbuildArgs } from '../../common/get-esbuild-args'
import { FsTree } from '@nrwl/tao/src/shared/tree'

export default async function runExecutor(
    options: BuildExecutorSchema,
    context: ExecutorContext,
) {
    if (!context.projectName) {
        throw new Error('No projectName')
    }
    const appRoot = context.workspace.projects[context.projectName].root
    const tree = new FsTree(context.cwd, context.isVerbose)

    const packageJson = readJson(tree, `${appRoot}/package.json`)

    const args = getEsbuildArgs(
        options,
        appRoot,
        Object.keys(packageJson?.dependencies || {}),
        Object.keys(packageJson?.devDependencies || {}),
    )

    const esbuild = execa('esbuild', args)
    esbuild.stdout?.pipe(process.stdout)
    esbuild.stderr?.pipe(process.stderr)
    await esbuild

    return {
        success: true,
    }
}

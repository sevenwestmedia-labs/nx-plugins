import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing'
describe('typescript-project-references e2e', () => {
  it('should create typescript-project-references', async (done) => {
    const plugin = uniq('typescript-project-references')
    ensureNxProject(
      '@wanews/nx-typescript-project-references',
      'dist/libs/typescript-project-references',
    )
    await runNxCommandAsync(
      `generate @wanews/nx-typescript-project-references:typescript-project-references ${plugin}`,
    )

    const result = await runNxCommandAsync(`build ${plugin}`)
    expect(result.stdout).toContain('Executor ran')

    done()
  })

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('typescript-project-references')
      ensureNxProject(
        '@wanews/nx-typescript-project-references',
        'dist/libs/typescript-project-references',
      )
      await runNxCommandAsync(
        `generate @wanews/nx-typescript-project-references:typescript-project-references ${plugin} --directory subdir`,
      )
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`),
      ).not.toThrow()
      done()
    })
  })

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('typescript-project-references')
      ensureNxProject(
        '@wanews/nx-typescript-project-references',
        'dist/libs/typescript-project-references',
      )
      await runNxCommandAsync(
        `generate @wanews/nx-typescript-project-references:typescript-project-references ${plugin} --tags e2etag,e2ePackage`,
      )
      const nxJson = readJson('nx.json')
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage'])
      done()
    })
  })
})

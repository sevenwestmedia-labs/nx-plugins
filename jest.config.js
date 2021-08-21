const { getJestProjects } = require('@nrwl/jest')

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/typescript-project-references-e2e',
    '<rootDir>/apps/nx-esbuild-e2e',
    '<rootDir>/apps/nx-vite-e2e',
    '<rootDir>/apps/pulumi-e2e',
  ],
}

const { compilerOptions } = require('./tsconfig.base')
const { pathsToModuleNameMapper } = require('ts-jest')

module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts)?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'html'],
  coverageReporters: ['html'],
  transform: {
    '^.+.(tsx?|jsx?|html)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['/dist/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: __dirname,
  }),
}

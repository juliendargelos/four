const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

const all = process.cwd() === __dirname

const config = {
  preset: 'ts-jest',
  roots: all
    ? ['<rootDir>/packages']
    : ['<rootDir>/src', '<rootDir>/test'],
  testMatch: all
    ? ['<rootDir>/packages/*/test/**/*.ts']
    : ['<rootDir>/test/**/*.ts'],
  testPathIgnorePatterns: ['.+.d.ts'],
  rootDir: process.cwd(),
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `${__dirname}/`
  }),
  setupFiles: [`${__dirname}/jest.setup.js`]
}

module.exports = {
  projects: [
    {
      ...config,
      displayName: 'node',
      testEnvironment: 'node',
      globals: { environment: 'node' }
    },
    {
      ...config,
      displayName: 'browser',
      testEnvironment: 'jsdom',
      globals: { environment: 'browser' }
    },
    {
      ...config,
      displayName: 'old browser',
      testEnvironment: 'jsdom',
      globals: { environment: 'old browser' }
    }
  ],
  collectCoverage: true,
  collectCoverageFrom: all
    ? ['<rootDir>/packages/*/src/**/*']
    : ['<rootDir>/src/**/*'],
  coverageReporters: ['text']
}

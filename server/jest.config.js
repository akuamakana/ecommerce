/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^@__test__/(.*)$': '<rootDir>/src/__test__/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@resolvers/(.*)$': '<rootDir>/src/resolvers/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@test_utils/(.*)$': '<rootDir>/src/__test__/__utils__/$1',
  },
  collectCoverage: true,
  testSequencer: '<rootDir>/src/__test__/__utils__/testSequencer.js',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  detectOpenHandles: true,
};

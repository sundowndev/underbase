module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts'],
  coveragePathIgnorePatterns: [
    'types',
    '__tests__',
  ],
};

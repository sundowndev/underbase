module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: ['./packages/**/*.ts'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts'],
};

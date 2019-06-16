module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: 'spec.ts$',
  workerIdleMemoryLimit: '500M',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    './src/services/**',
    './src/utilities/**',
    './src/controllers/**',
    './src/modules/**',
    './src/passports/**',
    './src/utilities/custom-exception-filter.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 85,
      lines: 85,
    },
  },
};

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: '\\.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
  setupFilesAfterEnv: ['jest-extended/all'],
};

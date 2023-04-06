/*eslint no-undef: "error"*/
/*eslint-env node*/

process.env.TZ = "UTC"

module.exports = {
  testRegex: ["\\.spec\\.ts$"],
  collectCoverageFrom: ["**/*.ts", "!**/*.tsx"],
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "test-coverage",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
  },
  rootDir: ".",
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(@bloom-housing/ui-components/*)"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setup-tests.js"],
}

/*eslint no-undef: "error"*/
/*eslint-env node*/

process.env.TZ = "UTC"

module.exports = {
  testRegex: ["/*.test.tsx$", "/*.test.ts$"],
  collectCoverageFrom: ["**/*.ts", "**/*.tsx"],
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
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
  },
  rootDir: "..",
  roots: ["<rootDir>/shared-helpers"],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(@bloom-housing/ui-components/*)"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/shared-helpers/.jest/setup-tests.js"],
}

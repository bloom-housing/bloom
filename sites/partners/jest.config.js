/*eslint no-undef: "error"*/
/*eslint-env node*/

process.env.TZ = "UTC"

module.exports = {
  testRegex: ["/*.test.tsx$", "/*.test.ts$"],
  collectCoverageFrom: ["**/*.ts", "**/*.tsx"],
  coveragePathIgnorePatterns: [
    "cypress",
    "types",
    "__tests__",
    "page_content",
    "public",
    "next-env.d.ts",
    "sentry.client.config.ts",
    "sentry.server.config.ts",
    "sentry.edge.config.ts",
  ],
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "test-coverage",
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 34,
      lines: 45,
      statements: 45,
    },
  },
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
      isolatedModules: true,
    },
  },
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(@bloom-housing/ui-components)"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["../partners/.jest/setup-tests.js"],
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
  },
}

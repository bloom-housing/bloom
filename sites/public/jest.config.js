/*eslint no-undef: "error"*/
/*eslint-env node*/

module.exports = {
  testRegex: ["/*.test.tsx$", "/*.test.ts$"],
  globals: {
    "ts-jest": {
      tsConfig: "__tests__/tsconfig.json",
    },
  },
  rootDir: "../..",
  roots: ["<rootDir>/sites/public"],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/sites/public/.jest/setup-tests.js"],
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
  },
}

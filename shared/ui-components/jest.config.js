/*eslint no-undef: "error"*/
/*eslint-env node*/

process.env.TZ = "UTC"

module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
  rootDir: "../..",
  roots: ["<rootDir>/shared/ui-components"],
  transform: {
    "^.+\\.stories\\.[t|j]sx$": "@storybook/addon-storyshots/injectFileName",
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/shared/ui-components/.jest/setup-tests.js"],
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["storyshots.d.ts"],
}

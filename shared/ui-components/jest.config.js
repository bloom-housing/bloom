/*eslint no-undef: "error"*/
/*eslint-env node*/

module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  rootDir: "../..",
  roots: ["<rootDir>/shared/ui-components"],
  transform: { "^.+\\.[t|j]sx?$": "ts-jest" },
  setupFilesAfterEnv: ["<rootDir>/shared/ui-components/.jest/setup-tests.js"],
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy"
  },
  testPathIgnorePatterns: ["storyshots.d.ts"]
}

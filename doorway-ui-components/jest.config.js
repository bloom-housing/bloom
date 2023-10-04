/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testRegex: ["/*.test.tsx$", "/*.test.ts$"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
    "\\.mdx$": "<rootDir>/.jest/mock.js",
  },
  transformIgnorePatterns: ["node_modules/?!(nanoid|@bloom-housing/ui-components)/"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setup-tests.js"],
}

/*eslint no-undef: "error"*/
/*eslint-env node*/

module.exports = {
  setupFiles: ["<rootDir>/.jest/setup-tests.js"],
  transform: { "^.+\\.[t|j]sx?$": "babel-jest" },
  moduleNameMapper: {
    "\\.(scss|css|less)$": "identity-obj-proxy",
  },
}

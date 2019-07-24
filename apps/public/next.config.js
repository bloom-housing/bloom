const withTM = require("next-transpile-modules");

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withTM({
  transpileModules: ["@dahlia/ui-components"]
});

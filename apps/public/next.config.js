const withTM = require("next-transpile-modules");
const withSass = require('@zeit/next-sass')

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withSass(withTM({
  transpileModules: ["@dahlia"]
}));

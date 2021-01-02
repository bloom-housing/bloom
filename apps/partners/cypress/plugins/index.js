/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// Use Webpack to compile Typescript files so that we can use TypeScript in tests
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const webpack = require("@cypress/webpack-preprocessor")

/**
 * @type {Cypress.PluginConfig}
 */
export default (on) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
          // Ignore imported css files when building cypress tests (this doesn't affect the actual website build,
          // just the tests & utilities themselves)
          {
            test: /\.(sa|sc|c)ss$/,
            loader: "ignore-loader",
          },
        ],
      },
    },
    watchOptions: {},
  }

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("file:preprocessor", webpack(options))
}

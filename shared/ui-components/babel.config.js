/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = function(api) {
  api.cache(true)

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    "@babel/react",
    "@babel/preset-typescript"
  ]
  const plugins = ["require-context-hook"] // "@babel/plugin-proposal-export-default-from" ];

  return {
    presets,
    plugins
  }
}

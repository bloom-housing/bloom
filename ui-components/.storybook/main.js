const path = require("path")
const { resolve } = require("path")
const bloomTheme = require("../tailwind.config.js")
const tailwindVars = require("@bloom-housing/ui-components/tailwind.tosass.js")(bloomTheme)
const { NormalModuleReplacementPlugin } = require("webpack")

module.exports = {
  stories: ["../src/**/*.stories.@(tsx|mdx)"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
    "@storybook/addon-knobs",
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  // In trouble? try https://storybook.js.org/docs/configurations/custom-webpack-config/#debug-the-default-webpack-config
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              ident: "postcss",
              plugins: [require("tailwindcss"), require("autoprefixer")],
            },
          },
        },
        {
          loader: "sass-loader",
          options: {
            additionalData: tailwindVars,
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    })

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      ],
    })

    config.resolve.extensions.push(".ts", ".tsx")
    return config
  },
}

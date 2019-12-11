const bloomTheme = require("../tailwind.config.js")
const tailwindVars = require("@bloom-housing/ui-components/tailwind.tosass.js")(bloomTheme)

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader")
      },
      // Optional
      {
        loader: require.resolve("react-docgen-typescript-loader")
      }
    ]
  })

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      "style-loader",
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          plugins: [require("tailwindcss"), require("autoprefixer")]
        }
      },
      {
        loader: "sass-loader",
        options: {
          prependData: tailwindVars
        }
      }
    ]
  })
  config.resolve.extensions.push(".ts", ".tsx")
  return config
}

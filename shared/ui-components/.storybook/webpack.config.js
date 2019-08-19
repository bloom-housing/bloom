const path = require("path")
const include = path.resolve(__dirname, "../")

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
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
    include: path.resolve(__dirname, "../")
  })
  config.resolve.extensions.push(".ts", ".tsx")
  return config
}

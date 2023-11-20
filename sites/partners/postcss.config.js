/*eslint-env node*/

module.exports = {
  plugins: {
    "@csstools/postcss-global-data": {
      files: ["../../node_modules/@bloom-housing/ui-seeds/src/global/tokens/screens.scss"],
    },
    "postcss-custom-media": {},
    tailwindcss: {},
    autoprefixer: {},
  },
}

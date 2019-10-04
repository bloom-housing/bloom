const cloneDeep = require("clone-deep")
const bloomTheme = cloneDeep(require("@bloom/styles/tailwind.config.js"))

// Modify bloomTheme to override any Tailwind vars
// For example:
// bloomTheme.theme.colors.white = "#f0f0e9"

module.exports = bloomTheme

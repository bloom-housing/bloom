/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const cloneDeep = require("clone-deep")
const bloomTheme = cloneDeep(require("@bloom-housing/ui-components/tailwind.config.js"))

// Modify bloomTheme to override any Tailwind vars
// For example:
// bloomTheme.theme.colors.white = "#f0f0e9"

// Detroit style overrides.
// See the [Detroit style guide](https://detroitmi.gov/departments/department-innovation-and-technology/style-guide)
// and the [Detroit color scheme](https://detroitmi.gov/sites/detroitmi.localhost/files/2021-06/DetroitOpportunity_12.01%20%282%29.pdf?#page=14)
bloomTheme.theme.colors["primary-darker"] = "#004445"
bloomTheme.theme.colors["primary-dark"] = "#004445"
bloomTheme.theme.colors.primary = "#279989"
bloomTheme.theme.colors["primary-light"] = "#F2F2F2"
bloomTheme.theme.colors["primary-lighter"] = "#F2F2F2"
bloomTheme.theme.colors["gray-800"] = "#18252A"
bloomTheme.theme.colors["gray-950"] = "#000000"
bloomTheme.theme.colors.warn = "#feb70d"
bloomTheme.theme.colors["accent-cool"] = "#279989"
// Table link color
bloomTheme.theme.colors["blue-700"] = "#004445"
bloomTheme.theme.fontFamily.sans = [
  "Montserrat",
  "Open Sans",
  "Helvetica",
  "Arial",
  "Verdana",
  "sans-serif",
]
bloomTheme.theme.fontFamily.serif = ["Montserrat", "Droid Serif", "Georgia", "Times", "serif"]
bloomTheme.theme.fontFamily["alt-sans"] = [
  "Montserrat",
  "Lato",
  "Helvetica",
  "Arial",
  "Verdana",
  "sans-serif",
]

module.exports = bloomTheme

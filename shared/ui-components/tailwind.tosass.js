/* eslint-env node */

const tailwindToSassVars = bloomTheme => {
  const bloomColorVars = Object.keys(bloomTheme.theme.colors).map(colorKey => {
    return "$tailwind-" + colorKey + ": " + bloomTheme.theme.colors[colorKey] + ";"
  })
  const bloomScreenVars = Object.keys(bloomTheme.theme.screens).map(screenKey => {
    return "$tailwind-screens-" + screenKey + ": " + bloomTheme.theme.screens[screenKey] + ";"
  })
  return bloomColorVars.concat(bloomScreenVars).join("\n")
}

module.exports = tailwindToSassVars

/* eslint-env node */

const tailwindToSassVars = (bloomTheme) => {
  const bloomColorVars = Object.keys(bloomTheme.theme.colors).map((colorKey) => {
    if (typeof bloomTheme.theme.colors[colorKey] == "object") {
      // create a map varaible that can be used by the map-get SCSS function
      let colorMap = "$tailwind-" + colorKey + ": ("
      colorMap += Object.keys(bloomTheme.theme.colors[colorKey])
        .map((colorMapKey) => {
          return `${colorMapKey}: ${bloomTheme.theme.colors[colorKey][colorMapKey]}`
        })
        .join(", ")
      return colorMap + ");"
    } else {
      // return a simple variable
      return "$tailwind-" + colorKey + ": " + bloomTheme.theme.colors[colorKey] + ";"
    }
  })
  const bloomScreenVars = Object.keys(bloomTheme.theme.screens).map((screenKey) => {
    return "$tailwind-screens-" + screenKey + ": " + bloomTheme.theme.screens[screenKey] + ";"
  })

  // Uncomment this if you want to debug:
  // console.log(bloomColorVars.concat(bloomScreenVars).join("\n"))

  return bloomColorVars.concat(bloomScreenVars).join("\n")
}

module.exports = tailwindToSassVars

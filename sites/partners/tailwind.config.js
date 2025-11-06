/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const cloneDeep = require("clone-deep")
const bloomTheme = cloneDeep(require("@bloom-housing/ui-components/tailwind.config.js"))

// Modify bloomTheme to override any Tailwind vars
// For example:
// bloomTheme.theme.colors.white = "#f0f0e9"

// Add custom animations
bloomTheme.theme.extend = {
  ...bloomTheme.theme.extend,
  keyframes: {
    ...bloomTheme.theme.extend?.keyframes,
    "slide-in-right": {
      "0%": { transform: "translateX(2rem)", opacity: "0" },
      "100%": { transform: "translateX(0)", opacity: "1" },
    },
  },
  animation: {
    ...bloomTheme.theme.extend?.animation,
    "slide-in-right": "slide-in-right 0.4s ease-out",
  },
}

module.exports = {
  ...bloomTheme,
  purge: {
    enabled: process.env.NODE_ENV !== "development",
    content: [
      "./pages/**/*.tsx",
      "./src/**/*.tsx",
      "../../node_modules/@bloom-housing/ui-components/src/**/*.tsx",
    ],
    safelist: [/grid-cols-/],
  },
}

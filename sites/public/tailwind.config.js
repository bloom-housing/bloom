/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const bloomTheme = structuredClone(require("@bloom-housing/ui-components/tailwind.config.js"));

// Modify bloomTheme to override any Tailwind vars
// For example:
// bloomTheme.theme.colors.white = "#f0f0e9"

module.exports = {
  ...bloomTheme,
  purge: {
    enabled: process.env.NODE_ENV !== "development",
    content: [
      "./pages/**/*.tsx",
      "./src/**/*.tsx",
      "../../node_modules/@bloom-housing/shared-helpers/src/views/**/*.tsx",
      "../../node_modules/@bloom-housing/ui-components/src/**/*.tsx",
      "../../node_modules/@bloom-housing/shared-helpers/src/views/**/*.tsx",
    ],
    safelist: [/grid-cols-/],
  },
}

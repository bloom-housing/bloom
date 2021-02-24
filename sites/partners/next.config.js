/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require("next-transpile-modules")(["@bloom-housing"])
const withSass = require("@zeit/next-sass")
const withCSS = require("@zeit/next-css")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// Set up app-wide constants
let BACKEND_API_BASE = "http://localhost:3100"
if (process.env.INCOMING_HOOK_BODY && process.env.INCOMING_HOOK_BODY.startsWith("http")) {
  // This is a value that can get set via a Netlify webhook for branch deploys
  BACKEND_API_BASE = decodeURIComponent(process.env.INCOMING_HOOK_BODY)
} else if (process.env.BACKEND_API_BASE) {
  BACKEND_API_BASE = process.env.BACKEND_API_BASE
}
const LISTINGS_QUERY = process.env.LISTINGS_QUERY || "/listings"
console.log(`Using ${BACKEND_API_BASE}${LISTINGS_QUERY} for the listing service.`)

// Load the Tailwind theme and set up SASS vars
const bloomTheme = require("./tailwind.config.js")
const tailwindVars = require("@bloom-housing/ui-components/tailwind.tosass.js")(bloomTheme)

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withCSS(
  withBundleAnalyzer(
    withSass(
      withTM({
        env: {
          backendApiBase: BACKEND_API_BASE,
          listingServiceUrl: BACKEND_API_BASE + LISTINGS_QUERY,
        },
        sassLoaderOptions: {
          additionalData: tailwindVars,
        },
        // exportPathMap adapted from https://github.com/zeit/next.js/blob/canary/examples/with-static-export/next.config.js
        exportPathMap() {
          // define page paths for various available languages
          const translatablePaths = {
            "/": { page: "/" },
            "/sign-in": { page: "/sign-in" },
            "/forgot-password": { page: "/forgot-password" },
            "/reset-password": { page: "/reset-password" },
            "/listings/applications": { page: "/listings/applications" },
            "/listings/applications/add": { page: "/listings/applications/add" },
            "/application": { page: "/application" },
            "/application/edit": { page: "/application/edit" },
            "/listings/flags": { page: "/listings/flags" },
            "/applicationFlaggedSets": { page: "/listings/flags/details" },
          }

          const languages = ["es", "zh", "vi"] // add new language codes here
          const languagePaths = {}
          Object.entries(translatablePaths).forEach(([key, value]) => {
            languagePaths[key] = value
            languages.forEach((language) => {
              const query = Object.assign({}, value.query)
              query.language = language
              languagePaths[`/${language}${key.replace(/^\/$/, "")}`] = {
                ...value,
                query: query,
              }
            })
          })

          return languagePaths
        },
      })
    )
  )
)

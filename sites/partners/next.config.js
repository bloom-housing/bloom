/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require("next-transpile-modules")(["@bloom-housing"])
const withSass = require("@zeit/next-sass")
const withCSS = require("@zeit/next-css")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withMDX = require("@next/mdx")()

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
    withMDX(
      withSass(
        withTM({
          target: "serverless",
          env: {
            backendApiBase: BACKEND_API_BASE,
            listingServiceUrl: BACKEND_API_BASE + LISTINGS_QUERY,
            idleTimeout: process.env.IDLE_TIMEOUT,
            showDuplicates: process.env.SHOW_DUPLICATES === "TRUE",
          },
          i18n: {
            locales: process.env.LANGUAGES ? process.env.LANGUAGES.split(",") : ["en"],
            defaultLocale: "en",
          },
          sassLoaderOptions: {
            additionalData: tailwindVars,
          },
        })
      )
    )
  )
)

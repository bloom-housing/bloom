/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require("next-transpile-modules")(["@bloom-housing"])
const withSass = require("@zeit/next-sass")
const withCSS = require("@zeit/next-css")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const axios = require("axios")
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
        async exportPathMap() {
          // we fetch our list of listings, this allow us to dynamically generate the exported pages
          let listings = []
          try {
            const response = await axios.get(BACKEND_API_BASE + LISTINGS_QUERY)
            listings = response.data
          } catch (error) {
            console.log(error)
          }

          // tranform the list of posts into a map of pages with the pathname `/post/:id`
          const listingPaths =
            (listings &&
              listings.reduce(
                (listingPaths, listing) =>
                  Object.assign({}, listingPaths, {
                    [`/listings/${listing.id}/applications`]: {
                      page: "/applications",
                      query: { id: listing.id },
                    },
                  }),
                {}
              )) ||
            {}

          // define page paths for various available languages
          const translatablePaths = Object.assign({}, listingPaths, {
            "/": { page: "/" },
            "/listings": { page: "/listings" },
          })
          const languages = ["es"] // add new language codes here
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

          // combine the map of all various types of page paths
          return Object.assign({}, languagePaths, {
            "/sign-in": { page: "/sign-in" },
          })
        },
      })
    )
  )
)

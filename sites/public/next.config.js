/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require("next-transpile-modules")(["@bloom-housing"])
const withSass = require("@zeit/next-sass")
const withCSS = require("@zeit/next-css")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withMDX = require("@next/mdx")()
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

const MAPBOX_TOKEN =
  process.env.MAPBOX_TOKEN ||
  "pk.eyJ1IjoibWplZHJhcyIsImEiOiJjazI2OHA5YzQycTBpM29xdDVwbXNyMDlwIn0.XS5ilGzTh_yVl3XY-8UKeA"
const HOUSING_COUNSELOR_SERVICE_URL = process.env.HOUSING_COUNSELOR_SERVICE_URL

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
          env: {
            backendApiBase: BACKEND_API_BASE,
            listingServiceUrl: BACKEND_API_BASE + LISTINGS_QUERY,
            mapBoxToken: MAPBOX_TOKEN,
            housingCounselorServiceUrl: HOUSING_COUNSELOR_SERVICE_URL,
            gtmKey: process.env.GTM_KEY || null,
            languages: process.env.LANGUAGES || "en",
            idleTimeout: process.env.IDLE_TIMEOUT,
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
            const listingPaths = listings.reduce(
              (listingPaths, listing) =>
                Object.assign({}, listingPaths, {
                  [`/listing/${listing.id}/${listing.urlSlug}`]: {
                    page: "/listing",
                    query: { id: listing.id },
                  },
                  // Create a redirect so that the base ID redirects to the ID with URL slug
                  [`/listing/${listing.id}`]: {
                    page: "/redirect",
                    query: { to: `/listing/${listing.id}/${listing.urlSlug}` },
                  },
                }),
              {}
            )

            // define page paths for various available languages
            const translatablePaths = Object.assign({}, listingPaths, {
              "/": { page: "/" },
              "/listings": { page: "/listings" },
              "/housing-counselors": { page: "/housing-counselors" },
              "/applications/start/choose-language": {
                page: "/applications/start/choose-language",
              },
              "/applications/start/what-to-expect": {
                page: "/applications/start/what-to-expect",
              },
              "/applications/start/autofill": {
                page: "/applications/start/autofill",
              },
              "/applications/review/confirmation": {
                page: "/applications/review/confirmation",
              },
              "/applications/review/demographics": {
                page: "/applications/review/demographics",
              },
              "/applications/review/summary": {
                page: "/applications/review/summary",
              },
              "/applications/review/terms": {
                page: "/applications/review/terms",
              },
              "/applications/reserved/units": {
                page: "/applications/reserved/units",
              },
              "/applications/preferences/general": {
                page: "/applications/preferences/general",
              },
              "/applications/preferences/all": {
                page: "/applications/preferences/all",
              },
              "/applications/household/ada": {
                page: "/applications/household/ada",
              },
              "/applications/household/add-members": {
                page: "/applications/household/add-members",
              },
              "/applications/household/current": {
                page: "/applications/household/current",
              },
              "/applications/household/live-alone": {
                page: "/applications/household/live-alone",
              },
              "/applications/household/member": {
                page: "/applications/household/member",
              },
              "/applications/household/members-info": {
                page: "/applications/household/members-info",
              },
              "/applications/household/preferred-units": {
                page: "/applications/household/preferred-units",
              },
              "/applications/financial/income": {
                page: "/applications/financial/income",
              },
              "/applications/financial/vouchers": {
                page: "/applications/financial/vouchers",
              },
              "/applications/contact/address": {
                page: "/applications/contact/address",
              },
              "/applications/contact/alternate-contact-contact": {
                page: "/applications/contact/alternate-contact-contact",
              },
              "/applications/contact/alternate-contact-name": {
                page: "/applications/contact/alternate-contact-name",
              },
              "/applications/contact/alternate-contact-type": {
                page: "/applications/contact/alternate-contact-type",
              },
              "/applications/contact/name": {
                page: "/applications/contact/name",
              },
              "/disclaimer": { page: "/disclaimer" },
              "/privacy": { page: "/privacy" },
              "/sign-in": { page: "/sign-in" },
              "/forgot-password": { page: "/forgot-password" },
              "/reset-password": { page: "/reset-password" },
              "/create-account": { page: "/create-account" },
              "/account/applications": { page: "/account/applications" },
              "/account/application": { page: "/account/application" },
              "/account/edit": { page: "/account/edit" },
              "/account/dashboard": { page: "/account/dashboard" },
            })
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

            // combine the map of all various types of page paths
            return languagePaths
          },
        })
      )
    )
  )
)

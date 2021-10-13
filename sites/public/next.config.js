/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require("next-transpile-modules")([
  "@bloom-housing/ui-components",
  "@bloom-housing/backend-core",
])
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

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN
const HOUSING_COUNSELOR_SERVICE_URL = process.env.HOUSING_COUNSELOR_SERVICE_URL

// Load the Tailwind theme and set up SASS vars
const bloomTheme = require("./tailwind.config.js")
const tailwindVars = require("@bloom-housing/ui-components/tailwind.tosass.js")(bloomTheme)

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withBundleAnalyzer(
  withTM({
    target: "serverless",
    env: {
      backendApiBase: BACKEND_API_BASE,
      listingServiceUrl: BACKEND_API_BASE + LISTINGS_QUERY,
      listingPhotoSize: process.env.LISTING_PHOTO_SIZE || "1302",
      mapBoxToken: MAPBOX_TOKEN,
      housingCounselorServiceUrl: HOUSING_COUNSELOR_SERVICE_URL,
      gtmKey: process.env.GTM_KEY || null,
      idleTimeout: process.env.IDLE_TIMEOUT,
      jurisdictionName: process.env.JURISDICTION_NAME,
      cacheRevalidate: process.env.CACHE_REVALIDATE ? Number(process.env.CACHE_REVALIDATE) : 60,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
    i18n: {
      locales: process.env.LANGUAGES ? process.env.LANGUAGES.split(",") : ["en"],
      defaultLocale: "en",
    },
    sassOptions: {
      additionalData: tailwindVars,
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.md$/,
        type: "asset/source",
      })
      return config
    },
  })
)

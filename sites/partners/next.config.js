/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require("next-transpile-modules")([
  "@bloom-housing/ui-seeds",
  "@bloom-housing/shared-helpers",
  "@bloom-housing/ui-components",
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

const BACKEND_PROXY_BASE = process.env.BACKEND_PROXY_BASE

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN
// Load the Tailwind theme and set up SASS vars
const bloomTheme = require("./tailwind.config.js")
const tailwindVars = require("@bloom-housing/ui-components/tailwind.tosass.js")(bloomTheme)

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withBundleAnalyzer(
  withTM({
    env: {
      backendApiBase: BACKEND_API_BASE,
      backendProxyBase: BACKEND_PROXY_BASE,
      listingServiceUrl: BACKEND_API_BASE + LISTINGS_QUERY,
      idleTimeout: process.env.IDLE_TIMEOUT,
      showSmsMfa: (process.env.SHOW_SMS_MFA || "TRUE") === "TRUE", // SMS on by default
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryKey: process.env.CLOUDINARY_KEY,
      cloudinarySignedPreset: process.env.CLOUDINARY_SIGNED_PRESET,
      mapBoxToken: MAPBOX_TOKEN,
      reCaptchaKey: process.env.RECAPTCHA_KEY,
      showLottery: process.env.SHOW_LOTTERY === "TRUE",
      lotteryDaysTillExpiry: process.env.LOTTERY_DAYS_TILL_EXPIRY,
      applicationExportAsSpreadsheet: process.env.APPLICATION_EXPORT_AS_SPREADSHEET === "TRUE",
      limitClosedListingActions: process.env.LIMIT_CLOSED_LISTING_ACTIONS === "TRUE",
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
    // Uncomment line below before building when using symlink for UI-C
    // experimental: { esmExternals: "loose" },
  })
)

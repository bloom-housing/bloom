/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

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
} else if (process.env.BACKEND_PROXY_BASE) {
  BACKEND_API_BASE = process.env.BACKEND_PROXY_BASE
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

module.exports = withBundleAnalyzer({
  env: {
    backendApiBase: BACKEND_API_BASE, // this has to be set for tests
    backendProxyBase: process.env.BACKEND_PROXY_BASE,
    listingsQuery: LISTINGS_QUERY,
    listingPhotoSize: process.env.LISTING_PHOTO_SIZE || "1302",
    mapBoxToken: MAPBOX_TOKEN,
    housingCounselorServiceUrl: HOUSING_COUNSELOR_SERVICE_URL,
    gtmKey: process.env.GTM_KEY || null,
    idleTimeout: process.env.IDLE_TIMEOUT,
    jurisdictionName: process.env.JURISDICTION_NAME,
    cacheRevalidate: process.env.CACHE_REVALIDATE ? Number(process.env.CACHE_REVALIDATE) : 30,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    showProfessionalPartners: process.env.SHOW_PROFESSIONAL_PARTNERS === "TRUE",
    showPublicLottery: process.env.SHOW_PUBLIC_LOTTERY === "TRUE",
    showNewSeedsDesigns: process.env.SHOW_NEW_SEEDS_DESIGNS === "TRUE",
    showMandatedAccounts: process.env.SHOW_MANDATED_ACCOUNTS === "TRUE",
    showPwdless: process.env.SHOW_PWDLESS === "TRUE",
    notificationsSignUpUrl: process.env.NOTIFICATIONS_SIGN_UP_URL || null,
    maintenanceWindow: process.env.MAINTENANCE_WINDOW,
    siteMessageWindow: process.env.SITE_MESSAGE_WINDOW,
    mtcDataUrl: process.env.MTC_DATA_URL,
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    awsRegion: process.env.AWS_REGION,
    fileService: process.env.FILE_SERVICE,
    reCaptchaKey: process.env.RECAPTCHA_KEY,
    maxClosedListings: process.env.MAX_CLOSED_LISTINGS,
    maxOpenListings: process.env.MAX_OPEN_LISTINGS,
    rtlLanguages: process.env.RTL_LANGUAGES || "ar",
  },
  i18n: {
    locales: process.env.LANGUAGES ? process.env.LANGUAGES.split(",") : ["en"],
    defaultLocale: "en",
  },
  sassOptions: {
    additionalData: tailwindVars,
  },
  transpilePackages: [
    "@bloom-housing/ui-seeds",
    "@bloom-housing/shared-helpers",
    "@bloom-housing/ui-components",
    "@bloom-housing/doorway-ui-components",
  ],
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        type: "asset/source",
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      }
    )
    return config
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'none';`,
          },
        ],
      },
    ]
  },
  // Uncomment line below before building when using symlink for UI-C
  // experimental: { esmExternals: "loose" },
})

if (process.env.SENTRY_ORG) {
  // Injected content via Sentry wizard below

  const { withSentryConfig } = require("@sentry/nextjs")

  module.exports = withSentryConfig(
    module.exports,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,

      org: process.env.SENTRY_ORG,
      project: "public",
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    }
  )
}

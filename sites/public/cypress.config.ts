import { defineConfig } from "cypress"
import { cypressConfig } from "@axe-core/watcher"
import dotenv from "dotenv"
dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let config: Cypress.ConfigOptions<any> = {
  defaultCommandTimeout: 100000,
  projectId: "bloom-public-reference",
  pageLoadTimeout: 100000,
  video: true,
  videoUploadOnPasses: false,
  numTestsKeptInMemory: 0,
  viewportHeight: 1500,
  env: {
    codeCoverage: {
      url: "/api/__coverage__",
    },
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    experimentalRunAllSpecs: true,
    env: {
      showSeedsDesign: process.env.SHOW_NEW_SEEDS_DESIGNS,
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
}

const axeDeveloperHubConfig = {
  axe: {
    apiKey: process.env.AXE_DEVELOPER_HUB_API_KEY,
  },
}

if (process.env.IN_CI !== "TRUE") {
  config = { ...axeDeveloperHubConfig, ...config }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineConfig(cypressConfig(config as any))

import { defineConfig } from "cypress"
import { cypressConfig } from "@axe-core/watcher"
import dotenv from "dotenv"
dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let baseConfig: Cypress.ConfigOptions<any> = {
  defaultCommandTimeout: 50000,
  projectId: "xetbmt",
  numTestsKeptInMemory: 0,
  trashAssetsBeforeRuns: true,
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
    baseUrl: "http://localhost:3001",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    experimentalRunAllSpecs: true,
    supportFile: "cypress/support/e2e.ts",
    env: {
      runAccessibilityTests: process.env.RUN_ACCESSIBILITY_E2E_TESTS === "TRUE",
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
}

if (process.env.RUN_ACCESSIBILITY_E2E_TESTS === "TRUE") {
  baseConfig = cypressConfig({
    axe: {
      apiKey: process.env.AXE_DEVELOPER_HUB_API_KEY,
    },
    ...baseConfig,
  })
}

export default defineConfig(baseConfig)

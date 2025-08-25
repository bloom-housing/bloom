import { defineConfig } from "cypress"
import { cypressConfig } from "@axe-core/watcher"
import dotenv from "dotenv"
dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let baseConfig: Cypress.ConfigOptions<any> = {
  defaultCommandTimeout: 60000,
  projectId: "f32m8f",
  pageLoadTimeout: 100000,
  video: true,
  numTestsKeptInMemory: 0,
  scrollBehavior: "center",
  viewportHeight: 1500,
  env: {
    codeCoverage: {
      url: "/api/__coverage__",
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Allow for custom logging. See https://docs.cypress.io/api/commands/task#Usage
      on("task", {
        log(message) {
          console.log(message)
          return null
        },
      })

      // We've imported your old cypress plugins here.
      // You may want to clean this up later by importing these.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    experimentalRunAllSpecs: true,
    env: {
      showSeedsDesign: process.env.SHOW_NEW_SEEDS_DESIGNS === "TRUE",
      runAccessibilityTests: process.env.RUN_ACCESSIBILITY_E2E_TESTS === "TRUE",
    },
    supportFile: "cypress/support/e2e.ts",
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

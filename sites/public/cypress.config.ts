import { defineConfig } from "cypress"
import dotenv from "dotenv"
dotenv.config()

export default defineConfig({
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
      showSeedsDesign: process.env.SHOW_NEW_SEEDS_DESIGNS,
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
})

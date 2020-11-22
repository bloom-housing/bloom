/* eslint-disable no-undef */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import * as routes from "../fixtures/routes.json"
import * as listingConfig from "../fixtures/listingConfig.json"
import { setProperty } from "./helpers"

const listingsUrl = "http://localhost:3100/listings"

Cypress.Commands.add("getByID", (id, ...args) => {
  return cy.get(`#${CSS.escape(id)}`, ...args)
})

Cypress.Commands.add("goNext", () => {
  return cy.get("button").contains("Next").click()
})

Cypress.Commands.add("goToReview", () => {
  return cy.get("button").contains("Save and return to review").click()
})

Cypress.Commands.add("loadConfig", (initialValues, configFile = "applicationConfigBlank.json") => {
  cy.fixture(configFile).then((applicationConfig) => {
    const config = applicationConfig

    if (initialValues) {
      Object.keys(initialValues).forEach((item) => {
        setProperty(config, item, initialValues[item])
      })
    }

    const values = JSON.stringify(config)

    sessionStorage.setItem("bloom-app-autosave", values)
  })

  // it loads the first listing from the backend and merge with sample configuration
  cy.request("GET", listingsUrl).then((res) => {
    const listing = res.body.listings[0]

    const completeListingData = { ...listing, ...listingConfig }
    sessionStorage.setItem("bloom-app-listing", JSON.stringify(completeListingData))
  })
})

Cypress.Commands.add("getSubmissionContext", () => {
  const config = sessionStorage.getItem("bloom-app-autosave")
  return JSON.parse(config)
})

Cypress.Commands.add("checkErrorAlert", (command) => {
  cy.get(".alert-box").should(command)
})

Cypress.Commands.add("checkErrorMessages", (command) => {
  cy.get(".error-message").should(command)
})

Cypress.Commands.add("isNextRouteValid", (currentStep, skip = 0) => {
  cy.fixture("listing.json").then((listingData) => {
    const steps = listingData.applicationConfig.steps

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const nextRouteIndex = steps.findIndex((item) => item.name === currentStep) + 1 + skip
    const nextRouteName = steps[nextRouteIndex] ? steps[nextRouteIndex].name : ""
    const nextRoutePath = routes[nextRouteName]

    cy.location("pathname").should("include", nextRoutePath)
  })
})

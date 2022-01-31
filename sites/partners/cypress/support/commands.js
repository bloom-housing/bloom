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
import "cypress-file-upload"

Cypress.Commands.add("getByID", (id, ...args) => {
  return cy.get(`#${CSS.escape(id)}`, ...args)
})

Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-test-id="${testId}"]`)
})

Cypress.Commands.add("login", () => {
  cy.visit("/")
  cy.fixture("user").then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get(".button").contains("Sign In").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("loginWithMfa", () => {
  cy.visit("/")
  cy.fixture("mfaUser").then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get(".button").contains("Sign In").click()
    cy.getByTestId("verify-by-email").click()
    cy.getByTestId("sign-in-mfa-code-field").type(user.mfaCode)
    cy.getByTestId("verify-and-sign-in").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("signOut", () => {
  cy.get("button").contains("Sign Out").click()
  cy.get("input#email")
})

Cypress.Commands.add("verifyAlertBox", () => {
  cy.get(".status-aside__buttons > .grid-section > .grid-section__inner > :nth-child(1) > .button")
    .contains("Publish")
    .click()
  cy.get("[data-testid=footer] > .grid-section > .grid-section__inner > :nth-child(1) > .button")
    .contains("Publish")
    .click()
  cy.get(".alert-box").contains(
    "Please resolve any errors before saving or publishing your listing."
  )
})

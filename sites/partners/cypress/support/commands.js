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
    cy.get(".button").contains("Sign in").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("signOut", () => {
  cy.get("button").contains("Sign out").click()
  cy.get("input#email")
})

const fillFormFieldHelper = (byTestID, fieldKey, fixtureKey, fixture, shouldSelect) => {
  let elem
  if (byTestID) {
    elem = cy.getByTestId(fieldKey)
  } else {
    elem = cy.getByID(fieldKey)
  }

  if (shouldSelect) {
    elem.select(fixture[fixtureKey])
  } else {
    elem.type(fixture[fixtureKey])
  }
}

Cypress.Commands.add("fillFormFields", (fixture, fieldsToType, fieldsToSelect) => {
  cy.fixture(fixture).then((obj) => {
    fieldsToType.forEach(({ byTestID = false, fieldID, fixtureID = fieldID }) => {
      fillFormFieldHelper(byTestID, fieldID, fixtureID, obj, false)
    })

    fieldsToSelect.forEach(({ byTestID = false, fieldID, fixtureID = fieldID }) => {
      fillFormFieldHelper(byTestID, fieldID, fixtureID, obj, true)
    })
  })
})

const verifyHelper = (byTestID, fieldKey, fixtureKey, fixture, hardcodedValue) => {
  let elem
  if (byTestID) {
    elem = cy.getByTestId(fieldKey)
  } else {
    elem = cy.getByID(fieldKey)
  }

  const val = hardcodedValue ?? fixture[fixtureKey]
  elem.contains(val).should("have.text", val)
}

Cypress.Commands.add("verifyFormFields", (fixture, fieldsToVerify) => {
  cy.fixture(fixture).then((obj) => {
    fieldsToVerify.forEach(({ byTestID = false, fieldID, fixtureID = fieldID, hardcodedValue }) => {
      verifyHelper(byTestID, fieldID, fixtureID, obj, hardcodedValue)
    })
  })
})

// see: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

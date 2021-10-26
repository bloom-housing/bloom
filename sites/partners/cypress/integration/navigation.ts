/// <reference types="cypress" />

describe("Navigating around the site", () => {
  before(() => {
    cy.fixture("user").then((user) => cy.createUser(user))
  })

  describe("with a logged out user", () => {
    beforeEach(() => {
      cy.logout()
    })

    it("visiting the homepage redirects to sign in page", () => {
      cy.visit("/")
      // Check if sign in prompt is displayed
      cy.contains("Sign In")
    })

    it("Signs in", () => {
      cy.visit("/")
      cy.fixture("user").then((user) => {
        cy.get("input#email").type(user.email)
        cy.get("input#password").type(user.password)
        cy.get(".button.is-filled").contains("Sign In").click()
        cy.contains("This will be the home page")
      })
    })

    it("Forgot password does not show alert", () => {
      cy.visit("/")
      cy.contains("Forgot password?").click()
      cy.contains("Send email")
      cy.get(".alert-box").should("not.exist")
    })
  })

  describe("with a logged in user", () => {
    beforeEach(() => {
      cy.fixture("user").then(({ email, password }) => cy.login(email, password))
    })

    it("Visits the applications page using the home page link", () => {
      cy.visit("/")
      cy.contains("View Submitted Applications").click()
      cy.contains("List of Applications will go here.")
    })
  })
})

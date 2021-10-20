/// <reference types="cypress" />

describe("Navigating around the site", () => {
  describe("with a logged out user", () => {
    beforeEach(() => {
      cy.logout()
    })

    it("visiting the homepage redirects to sign in page", () => {
      cy.visit("/")
      // Check if sign in prompt is displayed
      cy.contains("Sign In")
    })

    // Note: this test relies on the user referenced by the user.json fixture already existing (as an admin user) in the database.
    it("Signs in", () => {
      cy.visit("/")
      cy.fixture("user").then((user) => {
        cy.get("input#email").type(user.email)
        cy.get("input#password").type(user.password)
        cy.get(".button.is-primary").contains("Sign In").click()
        cy.contains("Listings")
      })
    })

    it("Forgot password does not show alert", () => {
      cy.visit("/")
      cy.get("aside").contains("a").click()
      cy.contains("Send email")
      cy.get('.alert-box').should('not.exist')
    })
  })

  describe("with a logged in user", () => {
    // Note: this test relies on the user referenced by the user.json fixture already existing (as an admin user) in the database.
    beforeEach(() => {
      cy.fixture("user").then(({ email, password }) => cy.login(email, password))
    })

    it("Visits the listings page using the home page link and clicks to add a new listing", () => {
      cy.visit("/")
      cy.contains("Listings")
      cy.contains("Add Listing").click()
      cy.contains("Listing Details")
    })
  })
})

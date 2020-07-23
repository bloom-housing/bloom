/// <reference types="cypress" />

describe("Navigating around the site", () => {
  it("Loads the homepage directly", () => {
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

  it("Applications page", () => {
    cy.fixture("user")
      .then(({ email, password }) => cy.login(email, password))
      .then(() => {
        cy.visit("/")
        cy.contains("View Submitted Applications").click()
        cy.contains("List of Applications will go here.")
      })
  })
})

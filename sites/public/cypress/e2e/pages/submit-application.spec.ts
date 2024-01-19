import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.submitApplication("Test: Coliseum", coliseumApplication, false)
  })
  it("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.submitApplication("Test: Default, No Preferences", minimalDataApplication, false)
  })
})

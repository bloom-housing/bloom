import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.log("submit 1")
    cy.submitApplication("Test: Coliseum", coliseumApplication)
  })
  it("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.log("submit 2")
    cy.submitApplication("Test: Default, No Preferences", minimalDataApplication, false)
  })
})

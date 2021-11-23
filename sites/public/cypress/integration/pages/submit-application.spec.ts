import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.submitApplication("Test: Coliseum", coliseumApplication)
  })
  it("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.submitApplication("Test: Default, No Preferences", minimalDataApplication, false)
  })
})

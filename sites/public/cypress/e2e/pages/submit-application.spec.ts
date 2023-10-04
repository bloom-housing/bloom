import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  // Skipping until frontend is connected
  it.skip("should submit an application for the Test: Coliseum listing", function () {
    cy.submitApplication("Test: Coliseum", coliseumApplication, false)
  })
  it.skip("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.submitApplication("Test: Default, No Preferences", minimalDataApplication, false)
  })
})

import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.submitApplication("1. [doorway] Test: Coliseum", coliseumApplication, false)
  })
  it("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.submitApplication(
      "3. [doorway] Test: Default, No Preferences",
      minimalDataApplication,
      false
    )
  })
})

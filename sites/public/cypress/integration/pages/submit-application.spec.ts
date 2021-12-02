import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function (done) {
    cy.submitApplication("Test: Coliseum", coliseumApplication, done)
  })
  it("should submit a minimal application for the Test: Default, No Preferences", function (done) {
    cy.submitApplication("Test: Default, No Preferences", minimalDataApplication, done, false)
  })
})

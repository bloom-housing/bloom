import { ElmVillageApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Elm Village listing", function () {
    cy.intercept("GET", "/geocoding/v5/**", { fixture: "address" })
    cy.submitApplication("Elm Village", ElmVillageApplication, false, true)
  })
  it("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.submitApplication("Blue Sky Apartments", minimalDataApplication, false, false)
  })
})

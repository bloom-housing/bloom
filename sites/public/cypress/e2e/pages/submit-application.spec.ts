import { ElmVillageApplication, autofillBlueSkyApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Elm Village listing, then autofill and submit an application for Blue Sky Apartments", function () {
    cy.intercept("GET", "/geocoding/v5/**", { fixture: "address" })
    // Interceptor for the address in the preference
    cy.intercept(
      "GET",
      "https://api.mapbox.com/geocoding/v5/mapbox.places/1600%20pennsylvania%20ave%2C%20Washington%2C%20DC%2020500%2C%20United%20States.json**",
      {
        features: [
          {
            place_name:
              "1600 pennsylvania ave, Washington, District of Columbia 20500, United States",
          },
        ],
      }
    )

    cy.submitApplication("Elm Village", ElmVillageApplication, false, true, false)
    cy.submitApplication("Blue Sky Apartments", autofillBlueSkyApplication, true, true, true)
  })
})

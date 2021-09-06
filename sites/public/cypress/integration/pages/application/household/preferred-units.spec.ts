const sampleUnit = {
  "id": "85d6dcda-8d98-4cbb-ad7b-e97daad38c96",
  "createdAt": "2021-09-06T06:57:56.816Z",
  "updatedAt": "2021-09-06T06:57:56.816Z",
  "amiPercentage": "80.0",
  "annualIncomeMin": "58152.0",
  "monthlyIncomeMin": "4858.0",
  "floor": 1,
  "annualIncomeMax": "103350.0",
  "maxOccupancy": 2,
  "minOccupancy": 1,
  "monthlyRent": "2624.0",
  "numBathrooms": null,
  "numBedrooms": 1,
  "number": null,
  "sqFeet": "750.00",
  "status": "occupied",
  "monthlyRentAsPercentOfIncome": null,
  "bmrProgramChart": null,
  "amiChartOverride": null,
  "unitType": {
      "id": "dff3ff70-7085-4dab-afd9-de4b33e0ec1e",
      "createdAt": "2021-09-06T06:57:36.127Z",
      "updatedAt": "2021-09-06T06:57:36.127Z",
      "name": "oneBdrm",
      "numBedrooms": 1
  },
  "unitRentType": null,
  "priorityType": null,
  "amiChart": {
      "id": "e0da1f85-3402-442a-b1cb-2b317b93d887"
  },
  "amiChartId": "e0da1f85-3402-442a-b1cb-2b317b93d887"
}

describe("applications/household/preferred-units", function () {
  const route = "/applications/household/preferred-units"

  beforeEach(() => {
    cy.loadConfig({
      units: [
        sampleUnit
      ]
    }, 'applicationConfigBlank.json', {})
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("preferredUnit-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.getByID(sampleUnit.unitType.id).check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferredUnitSize")

    // check context values
    cy.getSubmissionContext().should("deep.nested.include", {
      preferredUnit: [
        { id: sampleUnit.unitType.id }
      ],
    })
  })
})

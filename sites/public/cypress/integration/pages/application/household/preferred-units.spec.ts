describe("applications/household/preferred-units", function () {
  const route = "/applications/household/preferred-units"

  beforeEach(() => {
    cy.fixture("applications/unit.json").as("unit")
  })

  it("Should render form", function () {
    cy.loadConfig(
      {
        units: [this.unit],
      },
      "applicationConfigBlank.json",
      {}
    )
    cy.visit(route)

    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    cy.loadConfig(
      {
        units: [this.unit],
      },
      "applicationConfigBlank.json",
      {}
    )
    cy.visit(route)

    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("preferredUnit-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.loadConfig(
      {
        units: [this.unit],
      },
      "applicationConfigBlank.json",
      {}
    )
    cy.visit(route)

    cy.getByID(this.unit.unitType.id).check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferredUnitSize")

    // check context values
    cy.getSubmissionContext().should("deep.nested.include", {
      preferredUnit: [{ id: this.unit.unitType.id }],
    })
  })
})

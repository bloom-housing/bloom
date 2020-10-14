describe("applications/household/preferred-units", function () {
  beforeEach(() => {
    cy.loadConfig()
    cy.visit("/applications/household/preferred-units")
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/household/preferred-units")
  })

  it("Should display initial form errors", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("preferredUnit-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.getByID("studio").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferredUnitSize")

    // check context values
    cy.getSubmissionContext().should("deep.nested.include", {
      preferredUnit: ["studio"],
    })
  })
})

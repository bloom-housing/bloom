describe("applications/contact/alternate-contact-name", function () {
  beforeEach(() => {
    cy.loadConfig()
    cy.fixture("applications/alternate-contact-name.json").as("data")
    cy.visit("/applications/contact/alternate-contact-name")
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/contact/alternate-contact-name")
  })

  it("Should display initial form errors", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("firstName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("lastName-error").should("be.visible").and("not.to.be.empty")
  })

  // TODO: check agency if has been set in the previous step

  it("Should save form values and redirect to the next step", function () {
    cy.getByID("firstName").type(this.data["firstName"])
    cy.getByID("lastName").type(this.data["lastName"])

    cy.goNext()

    // no errors should be visible
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    // check next route
    cy.isNextRouteValid("alternateContactName")

    // check context values
    cy.getSubmissionContext().its("alternateContact").should("deep.nested.include", {
      firstName: this.data["firstName"],
      lastName: this.data["lastName"],
    })
  })
})

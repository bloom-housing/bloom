describe("applications/contact/alternate-contact-name", function () {
  beforeEach(() => {
    cy.fixture("applications/alternate-contact-name.json").as("data")
  })

  it("Should render form", function () {
    cy.loadConfig()
    cy.visit("/applications/contact/alternate-contact-name")

    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/contact/alternate-contact-name")
  })

  it("Should display initial form errors without agency field", function () {
    cy.loadConfig()
    cy.visit("/applications/contact/alternate-contact-name")

    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("firstName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("lastName-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should display initial form errors with agency field", function () {
    // set initial value for type to show additional agency step
    cy.loadConfig({
      "alternateContact.type": "caseManager",
    })
    cy.visit("/applications/contact/alternate-contact-name")

    cy.getByID("agency").should("be.visible")

    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("firstName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("lastName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("agency-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.loadConfig({
      "alternateContact.type": "caseManager",
    })
    cy.visit("/applications/contact/alternate-contact-name")

    cy.getByID("firstName").type(this.data["firstName"])
    cy.getByID("lastName").type(this.data["lastName"])
    cy.getByID("agency").type(this.data["agency"])

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
      agency: this.data["agency"],
    })
  })
})

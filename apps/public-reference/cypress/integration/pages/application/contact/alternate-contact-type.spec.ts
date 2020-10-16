describe("applications/contact/alternate-contact-type", function () {
  const route = "/applications/contact/alternate-contact-type"

  beforeEach(() => {
    cy.loadConfig()
    cy.fixture("applications/alternate-contact-type.json").as("data")
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("type-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should show error when other option is selected and input is empty", function () {
    cy.getByID("typeother").check()

    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("otherType-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.getByID("typeother").check()

    cy.getByID("otherType").type(this.data["otherType"])

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("alternateContactType")

    cy.getSubmissionContext().its("alternateContact").should("deep.nested.include", {
      type: this.data["typeOther"],
      otherType: this.data["otherType"],
    })
  })
})

describe("applications/contact/name", function () {
  const route = "/applications/contact/name"

  beforeEach(() => {
    cy.loadConfig()
    cy.fixture("applications/name.json").as("data")
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    // try to trigger form
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    // check errors
    cy.getByID("applicant.firstName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.lastName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.dateOfBirth-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.emailAddress-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should show error for incorrect email", function () {
    cy.getByID("applicant.emailAddress").type("test")

    cy.goNext()

    cy.getByID("applicant.emailAddress-error").should("be.visible").and("not.to.be.empty")
  })

  it("Shouldn't notify email error when checkbox is selected", function () {
    cy.getByID("noEmail").check()

    cy.goNext()

    cy.getByID("applicant.emailAddress-error").should("not.exist")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.getByID("applicant.firstName").type(this.data["applicant.firstName"])
    cy.getByID("applicant.middleName").type(this.data["applicant.middleName"])
    cy.getByID("applicant.lastName").type(this.data["applicant.lastName"])
    cy.getByID("applicant.birthMonth").type(this.data["applicant.birthMonth"])
    cy.getByID("applicant.birthDay").type(this.data["applicant.birthDay"])
    cy.getByID("applicant.birthYear").type(this.data["applicant.birthYear"])
    cy.getByID("applicant.emailAddress").type(this.data["applicant.emailAddress"])

    cy.goNext()

    // no errors should be visible
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    // check next route
    cy.isNextRouteValid("primaryApplicantName")

    // check context values
    cy.getSubmissionContext().its("applicant").should("deep.nested.include", {
      birthDay: this.data["applicant.birthDay"],
      birthMonth: this.data["applicant.birthMonth"],
      birthYear: this.data["applicant.birthYear"],
      emailAddress: this.data["applicant.emailAddress"],
      firstName: this.data["applicant.firstName"],
      lastName: this.data["applicant.lastName"],
      middleName: this.data["applicant.middleName"],
    })
  })
})

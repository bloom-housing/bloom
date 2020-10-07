describe("Form contact/name", function () {
  beforeEach(() => {
    cy.fixture("application/name.json").as("valuesJSON")
    cy.visit("/applications/contact/name")
  })

  it("Renders the /contact/name form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "/applications/contact/name")
  })

  it("Should display initial form errors", function () {
    // try to trigger form
    cy.goNext()

    // check errors
    cy.getByID("applicant.firstName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.lastName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.dateOfBirth-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.emailAddress-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should test incorrect email value", function () {
    cy.getByID("applicant.emailAddress").type("test")

    cy.goNext()

    cy.getByID("applicant.emailAddress-error").should("be.visible").and("not.to.be.empty")
  })

  it("Shouldn't notify email error when checkbox is selected", function () {
    cy.getByID("noEmail").check()

    cy.goNext()

    cy.getByID("applicant.emailAddress-error").should("not.exist")
  })

  it("should save form values and redirect to the next step", function () {
    cy.getByID("applicant.firstName").type(this.valuesJSON["applicant.firstName"])
    cy.getByID("applicant.middleName").type(this.valuesJSON["applicant.middleName"])
    cy.getByID("applicant.lastName").type(this.valuesJSON["applicant.lastName"])
    cy.getByID("applicant.birthMonth").type(this.valuesJSON["applicant.birthMonth"])
    cy.getByID("applicant.birthDay").type(this.valuesJSON["applicant.birthDay"])
    cy.getByID("applicant.birthYear").type(this.valuesJSON["applicant.birthYear"])
    cy.getByID("applicant.emailAddress").type(this.valuesJSON["applicant.emailAddress"])

    cy.goNext()

    // no errors should be visible
    cy.get(".error-message").should("not.exist")

    // check context values
    cy.getSubmissionContext().its("applicant").should("deep.include", {
      birthDay: this.valuesJSON["applicant.birthDay"],
      birthMonth: this.valuesJSON["applicant.birthMonth"],
      birthYear: this.valuesJSON["applicant.birthYear"],
      emailAddress: this.valuesJSON["applicant.emailAddress"],
      firstName: this.valuesJSON["applicant.firstName"],
      lastName: this.valuesJSON["applicant.lastName"],
      middleName: this.valuesJSON["applicant.middleName"],
    })

    // TODO: check next step (when steps config will be ready)
  })
})

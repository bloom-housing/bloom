describe("Form contact/name", function () {
  beforeEach(() => {
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
    cy.getByID("applicant.firstName-error")
      .should("be.visible")
      .and("contain", "Please enter a First Name")

    cy.getByID("applicant.lastName-error")
      .should("be.visible")
      .and("contain", "Please enter a Last Name")

    cy.get(".error-message")
      .should("be.visible")
      .and("contain", "Please enter a valid Date of Birth")

    cy.getByID("applicant.emailAddress-error")
      .should("be.visible")
      .and("contain", "Please enter an email address")
  })

  it("Should test incorrect email value", function () {
    cy.getByID("applicant.emailAddress").type("test")

    cy.goNext()

    cy.getByID("applicant.emailAddress-error")
      .should("be.visible")
      .and("contain", "Please enter an email address")
  })

  it("Shouldn't notify email error when checkbox is selected", function () {
    cy.getByID("noEmail").check()

    cy.goNext()

    cy.getByID("applicant.emailAddress-error").should("not.exist")
  })

  it("should save form values", function () {
    cy.getByID("applicant.firstName").type("Name")
    cy.getByID("applicant.middleName").type("Middle Name")
    cy.getByID("applicant.lastName").type("Last Name")
    cy.getByID("applicant.birthMonth").type("07")
    cy.getByID("applicant.birthDay").type("17")
    cy.getByID("applicant.birthYear").type("1996")
    cy.getByID("applicant.emailAddress").type("test@bloom.com")

    cy.goNext()

    // no errors should be visible
    cy.get(".error-message").should("not.exist")
  })
})

describe("Form contact/name", function () {
  it("Renders the /contact/name form", function () {
    cy.visit("/applications/contact/name")
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "/applications/contact/name")
  })

  it("Should display initial form errors", function () {
    // try to trigger form
    cy.get("button").contains("Next").click()

    // check errors
    cy.get('span[id="applicant.firstName-error"]').contains("Please enter a First Name")
    cy.get('span[id="applicant.lastName-error"]').contains("Please enter a Last Name")
    cy.get(".error-message").contains("Please enter a valid Date of Birth")
    cy.get('span[id="applicant.emailAddress-error"]').contains("Please enter an email address")
  })

  it("Should test incorrect email value", function () {
    cy.reload()

    cy.get("input[id='applicant.emailAddress']").type("test")
    cy.get("button").contains("Next").click()
    cy.get('span[id="applicant.emailAddress-error"]').contains("Please enter an email address")
  })

  it("Should not notify email error when checkbox is selected", function () {
    cy.reload()

    cy.get("input[id='noEmail']").check()
    cy.get("button").contains("Next").click()
    cy.get('span[id="applicant.emailAddress-error"]').should("not.exist")
  })

  it("should save form values", function () {
    cy.reload()

    cy.get("input[id='applicant.firstName']").type("Name")
    cy.get("input[id='applicant.middleName']").type("Middle Name")
    cy.get("input[id='applicant.lastName']").type("Middle Name")
    cy.get("input[id='applicant.birthMonth']").type("07")
    cy.get("input[id='applicant.birthDay']").type("17")
    cy.get("input[id='applicant.birthYear']").type("1996")
    cy.get("input[id='applicant.emailAddress']").type("test@bloom.com")

    cy.get("button").contains("Next").click()

    cy.get(".error-message").should("not.exist")
  })
})

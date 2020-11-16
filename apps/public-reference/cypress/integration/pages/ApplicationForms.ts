describe("New applications page", function () {
  it("renders the new application form", function () {
    cy.visit("/applications/start/choose-language")
    cy.get("form").should("have.length.of.at.least", 1)
    cy.get("h3.field-label--caps").contains("Choose Your Language")
  })

  it("validates form fields", function () {
    cy.visit("/applications/contact/name")
    cy.get("form input[name=applicant\\.firstName]").type("First Name")
    cy.get("form button").last().click()
    cy.get("form").contains("Please enter a Last Name")
    cy.get("form").should("not.contain", "Please enter a First Name")
  })
})

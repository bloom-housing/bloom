describe("New applications page", function () {
  it("renders the new application form", function () {
    cy.visit("/applications/start/choose-language")
    cy.get("form").should("have.length.of.at.least", 1)
    cy.get("h2.form-card__title").contains("Choose your language")
  })

  it("validates form fields", function () {
    cy.visit("/applications/contact/name")

    cy.get("form input[name=firstName]").type("First Name")

    cy.get("form button").last().click()

    cy.get("form").contains("Please enter a Last Name")

    cy.get("form").should("not.contain", "Please enter a First Name")
  })

  /*  it("goes to step 2", function () {
    cy.visit("/applications/new")
    cy.get("form input[name=firstname]").type("First Name")
    cy.get("form input[name=lastname]").type("Last Name")
    cy.get("form input[name=age]").type(42)
    cy.get("form#applications-new button").last().click()

    cy.get("form#applications-step2").contains("State")
  }) */
})

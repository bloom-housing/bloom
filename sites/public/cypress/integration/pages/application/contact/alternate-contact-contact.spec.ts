describe("applications/contact/alternate-contact-contact", function () {
  const route = "/applications/contact/alternate-contact-contact"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render the alternate contact contact sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()
    cy.location("pathname").should("include", route)
    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

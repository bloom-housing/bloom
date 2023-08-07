describe("applications/household/student", function () {
  const route = "/applications/household/student"

  beforeEach(() => {
    cy.visit(route)
  })

  it.skip("should render household student sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it.skip("should require form input", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

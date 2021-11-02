describe("applications/review/terms", function () {
  const route = "/applications/review/terms"

  function submitApplication() {
    cy.getByTestId("app-terms-submit-button").click()
  }

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render terms sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    submitApplication()
    cy.checkErrorAlert("be.visible")
  })
})

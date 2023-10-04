describe("applications/review/terms", function () {
  const route = "/applications/review/terms"

  function submitApplication() {
    cy.getByTestId("app-terms-submit-button").click()
  }

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render terms sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  //TODO: unskip this when applications are implemented on the frontend
  it.skip("should require form input", function () {
    submitApplication()
    cy.checkErrorMessages("be.visible")
  })
})

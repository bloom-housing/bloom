describe("applications/household/changes", function () {
  const route = "/applications/household/changes"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render expecting household changes sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should require form input", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

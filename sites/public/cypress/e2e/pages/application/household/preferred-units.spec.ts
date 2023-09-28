describe("applications/household/preferred-units", function () {
  const route = "/applications/household/preferred-units"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render preferred units sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

describe("applications/household/preferred-units", function () {
  const route = "/applications/household/preferred-units"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render preferred units sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

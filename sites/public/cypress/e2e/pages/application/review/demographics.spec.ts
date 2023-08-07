describe("applications/review/demographics", function () {
  const route = "/applications/review/demographics"

  beforeEach(() => {
    cy.visit(route)
  })

  it.skip("should render demographics sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

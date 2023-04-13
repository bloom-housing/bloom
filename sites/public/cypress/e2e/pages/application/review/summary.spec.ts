describe("applications/review/summary", function () {
  const route = "/applications/review/summary"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render summary page", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

describe("applications/review/summary", function () {
  const route = "/applications/review/summary"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render summary page", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

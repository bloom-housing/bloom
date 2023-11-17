describe("applications/review/demographics", function () {
  const route = "/applications/review/demographics"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it("should render demographics sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

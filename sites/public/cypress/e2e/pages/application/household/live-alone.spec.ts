describe("applications/household/live-alone", function () {
  const route = "/applications/household/live-alone"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render live alone sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

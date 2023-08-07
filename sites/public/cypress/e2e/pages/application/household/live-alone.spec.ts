describe("applications/household/live-alone", function () {
  const route = "/applications/household/live-alone"

  beforeEach(() => {
    cy.visit(route)
  })

  it.skip("should render live alone sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

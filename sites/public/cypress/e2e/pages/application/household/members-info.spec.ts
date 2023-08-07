describe("applications/household/members-info", function () {
  const route = "/applications/household/members-info"

  beforeEach(() => {
    cy.visit(route)
  })

  it.skip("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

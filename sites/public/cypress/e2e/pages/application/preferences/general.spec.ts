describe("applications/preferences/general", function () {
  const route = "/applications/preferences/general"

  beforeEach(() => {
    cy.visit(route)
  })

  it.skip("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})

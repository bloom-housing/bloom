describe("applications/preferences/general", function () {
  const route = "/applications/preferences/general"

  beforeEach(() => {
    cy.loadConfig({
      preferences: [],
    })
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should move to next step after 'Next' click", function () {
    cy.goNext()

    cy.isNextRouteValid("generalPool")
  })
})

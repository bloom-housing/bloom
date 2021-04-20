describe("applications/household/members-info", function () {
  const route = "/applications/household/members-info"

  beforeEach(() => {
    cy.loadConfig()
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should move to add-members", function () {
    cy.goNext()

    cy.location("pathname").should("include", "applications/household/add-members")
  })
})

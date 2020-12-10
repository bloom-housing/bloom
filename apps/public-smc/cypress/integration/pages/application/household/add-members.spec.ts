describe("applications/household/add-members", function () {
  const route = "/applications/household/add-members"

  beforeEach(() => {
    cy.loadConfig()
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should move to /contact/name after Edit click", function () {
    cy.getByID("edit-member").click()
    cy.location("pathname").should("include", "applications/contact/name")
  })

  it("Should move to /household/member Add member click", function () {
    cy.getByID("btn-add-member").click()
    cy.location("pathname").should("include", "applications/household/member")
  })

  it("Should move to next route Add member click", function () {
    cy.getByID("btn-add-done").click()
    cy.isNextRouteValid("addMembers")
  })
})

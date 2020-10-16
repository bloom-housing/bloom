describe("applications/preferences/general", function () {
  // TODO: Define initial value - in /preferences/select to none
  beforeEach(() => {
    cy.loadConfig()
    cy.visit("/applications/preferences/general")
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/preferences/general")
  })

  it("Should move to next step after 'Next' click", function () {
    cy.goNext()

    cy.isNextRouteValid("generalPool")
  })
})

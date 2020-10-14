describe("applications/household/members-info", function () {
  beforeEach(() => {
    cy.loadConfig()
    cy.visit("/applications/household/members-info")
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/household/members-info")
  })

  it("Should move to add-members", function () {
    cy.goNext()

    cy.location("pathname").should("include", "applications/household/add-members")
  })
})

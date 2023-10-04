describe("applications/household/member", function () {
  const route = "/applications/household/member"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render add household member sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should require form input", function () {
    cy.getByTestId("app-household-member-save").click()
    cy.location("pathname").should("include", route)
    cy.checkErrorAlert("be.visible")
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should show member address if user indicates they do not live at the same address", function () {
    cy.getByTestId("app-household-member-same-address").eq(1).check()
    cy.getByTestId("app-household-member-address-street").should("be.visible")
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should show member work address if user indicates they work in the region", function () {
    cy.getByTestId("app-household-member-work-in-region").eq(0).check()
    cy.getByTestId("app-household-member-work-address-street").should("be.visible")
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should go back to members screen without adding current member when user cancels", function () {
    cy.getByTestId("app-household-member-cancel").click()
    cy.location("pathname").should("include", "/applications/household/add-members")
  })
})

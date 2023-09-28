describe("applications/household/add-members", function () {
  const route = "/applications/household/add-members"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render add household members sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should move backward in form to /contact/name after editing primary household member", function () {
    cy.getByTestId("app-household-member-edit-button").click()
    cy.location("pathname").should("include", "applications/contact/name")
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should move to correct route on Add Member click", function () {
    cy.getByTestId("app-add-household-member-button").click()
    cy.location("pathname").should("include", "applications/household/member")
  })
})

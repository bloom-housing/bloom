describe("applications/preferences/all", function () {
  const route = "/applications/preferences/all"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render the all-preferences sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()
    cy.checkErrorAlert("be.visible")
  })

  it("should save values and redirect to the next step (user claimed at least one preference)", function () {
    cy.getByTestId("app-preference-option").check()
    cy.goNext()
    cy.checkErrorAlert("not.exist")

    cy.getByTestId("app-preference-option").eq(1).check()
    cy.goNext()
    cy.checkErrorAlert("not.exist")

    // Should skip one step
    cy.isNextRouteValid("preferencesAll", 1)
  })
})

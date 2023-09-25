// TODO: unskip after applications are implemented on the front end
describe.skip("applications/household/changes", function () {
  const route = "/applications/household/changes"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render expecting household changes sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

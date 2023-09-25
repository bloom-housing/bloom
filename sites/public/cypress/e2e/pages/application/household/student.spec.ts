// TODO: unskip after applications are implemented on the front end
describe.skip("applications/household/student", function () {
  const route = "/applications/household/student"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render household student sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

// TODO: unskip after applications are implemented on the front end
describe.skip("applications/household/ada", function () {
  const route = "/applications/household/ada"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should render ada sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()
    cy.checkErrorAlert("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should uncheck all other checkboxes when 'No' is selected", function () {
    cy.get("[data-testid=app-ada-mobility]").check()
    cy.get("[data-testid=app-ada-vision]").check()
    cy.get("[data-testid=app-ada-hearing]").check()

    cy.get("[data-testid=app-ada-none]").check()
    cy.get("[data-testid=app-ada-mobility]").should("not.be.checked")
    cy.get("[data-testid=app-ada-vision]").should("not.be.checked")
    cy.get("[data-testid=app-ada-hearing]").should("not.be.checked")
  })
})

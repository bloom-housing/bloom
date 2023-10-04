describe("applications/contact/name", function () {
  const route = "/applications/contact/name"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should render the primary contact name sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should require form input", function () {
    cy.goNext()
    cy.location("pathname").should("include", route)
    cy.checkErrorAlert("be.visible")
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should validate email fields", function () {
    cy.getByTestId("app-primary-email").type("not email format")
    cy.goNext()
    cy.location("pathname").should("include", route)
    cy.checkErrorAlert("be.visible")
    cy.reload()
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should disable email field when user indicates they have no email", function () {
    cy.getByTestId("app-primary-no-email").check()
    cy.getByTestId("app-primary-email").should("be.disabled")
    cy.reload()
  })
})

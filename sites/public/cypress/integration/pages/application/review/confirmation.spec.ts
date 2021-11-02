describe("applications/review/confirmation", function () {
  const route = "/applications/review/confirmation"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should redirect to create account page on click", function () {
    cy.getByTestId("app-confirmation-create-account").click()
    cy.location("pathname").should("include", "/create-account")
  })

  it("should redirect to home page on click", function () {
    cy.getByTestId("app-confirmation-done").click()
    cy.location("pathname").should("equals", "/")
  })

  it("should redirect to create account page", function () {
    cy.getByTestId("app-confirmation-create-account").click()
    cy.location("pathname").should("equals", "/create-account")
  })
})

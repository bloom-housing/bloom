describe("applications/review/confirmation", function () {
  const route = "/applications/review/confirmation"

  beforeEach(() => {
    cy.visit(route)
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should redirect to home page on click", function () {
    cy.getByTestId("app-confirmation-browse").click()
    cy.location("pathname").should("equals", "/listings")
  })

  // TODO: unskip after applications are implemented on the front end
  it.skip("should redirect to create account page", function () {
    cy.getByTestId("app-confirmation-create-account").click()
    cy.location("pathname").should("equals", "/create-account")
  })
})

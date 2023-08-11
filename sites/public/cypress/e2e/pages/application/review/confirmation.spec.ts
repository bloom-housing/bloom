describe("applications/review/confirmation", function () {
  const route = "/applications/review/confirmation"

  beforeEach(() => {
    cy.visit(route)
  })

  it("should redirect to home page on click", function () {
    cy.getByTestId("app-confirmation-browse").click()
    cy.location("pathname").should("equals", "/listings")
  })

  it("should redirect to create account page", function () {
    cy.getByTestId("app-confirmation-create-account").click()
    cy.location("pathname").should("equals", "/create-account")
  })
})

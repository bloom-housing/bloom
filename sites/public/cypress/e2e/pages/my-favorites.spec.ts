describe("My favorites page", function () {
  it("renders the my favorites page", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.url().should("include", "/account/dashboard")
    cy.getByID("account-dashboard-favorites").click()
    cy.location("pathname").should("include", "/account/favorites")
    cy.signOut()
  })
})

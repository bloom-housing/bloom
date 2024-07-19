describe("My applications page", function () {
  // Skipping this test until sign in / sign out functionality is back
  it("renders the my applications page", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.url().should("include", "/account/dashboard")
    cy.getByID("account-dashboard-applications").click()
    cy.location("pathname").should("include", "/account/applications")
    cy.signOut()
  })
})

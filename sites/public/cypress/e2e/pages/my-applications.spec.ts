describe("My applications page", function () {
  // Skipping until applications is connected
  it.skip("renders the my applications page", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.url().should("include", "/account/dashboard")
    cy.getByTestId("account-dashboard-applications").click()
    cy.location("pathname").should("include", "/account/applications")
    cy.signOut()
  })
})

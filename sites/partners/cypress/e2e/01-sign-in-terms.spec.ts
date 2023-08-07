describe("Log in and accept terms", () => {
  it.skip("should log in", () => {
    cy.loginAndAcceptTerms()
    cy.signOut()
  })
})

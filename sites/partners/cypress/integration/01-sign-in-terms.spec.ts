describe("Log in and accept terms", () => {
  it("should log in", () => {
    cy.loginAndAcceptTerms()
    cy.signOut()
  })
})

describe("Log in using MFA Tests", () => {
  it("should log in using mfa pathway", () => {
    cy.loginWithMfa()
    cy.signOut()
  })
})

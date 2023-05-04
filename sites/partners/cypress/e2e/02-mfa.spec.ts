describe("Log in using MFA Tests", () => {
  it("should log in using mfa pathway", () => {
    cy.intercept("POST", "api/adapter/auth/request-mfa-code", {
      statusCode: 201,
      body: {
        email: "mfauser@bloom.com",
      },
    })
    cy.loginWithMfa()
    cy.visit("/")
    cy.signOut()
  })
})

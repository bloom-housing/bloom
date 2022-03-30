describe("Log in using MFA Tests", () => {
  it("should log in using mfa pathway", () => {
    cy.intercept("POST", "/auth/request-mfa-code", {
      statusCode: 201,
      body: {
        email: "mfauser@bloom.com",
        yazeedTest: "yest",
      },
    })
    cy.loginWithMfa()
    cy.signOut()
  })
})

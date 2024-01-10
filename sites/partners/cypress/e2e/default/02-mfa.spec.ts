describe("Log in using MFA Tests", () => {
  it("should log in using mfa pathway", () => {
    cy.intercept("POST", "api/adapter/auth/request-mfa-code", {
      statusCode: 201,
      body: {
        email: "mfauser@bloom.com",
      },
    })
    cy.visit("/")
    cy.get("input#email").type("mfauser@bloom.com")
    cy.get("input#password").type("abcdef")
    cy.get("button").contains("Sign In").click()
    cy.getByID("verify-by-email").click()
    cy.getByTestId("sign-in-mfa-code-field").type("12345")
    cy.getByID("verify-and-sign-in").click()
    cy.contains("Listings")
    cy.visit("/")
    cy.signOut()
  })
})

describe("Log in and accept terms", () => {
  afterEach(() => {
    if (Cypress.env("runAccessibilityTests")) cy.axeWatcherFlush()
  })
  it("should log in", () => {
    cy.loginAndAcceptTerms("termsUnacceptedUser")
    cy.signOut()
  })
})

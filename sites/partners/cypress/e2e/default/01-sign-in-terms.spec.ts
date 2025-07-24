afterEach(() => {
  if (Cypress.env("IN_CI") !== "TRUE") cy.axeWatcherFlush()
})

describe("Log in and accept terms", () => {
  it("should log in", () => {
    cy.loginAndAcceptTerms("termsUnacceptedUser")
    cy.signOut()
  })
})

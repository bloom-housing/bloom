afterEach(() => {
  if (Cypress.env("IN_CI") !== "TRUE") cy.axeWatcherFlush()
})

describe("My applications page", function () {
  it("renders the my applications page", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.url().should("include", "/account/dashboard")
    cy.getByID("account-dashboard-applications").click()
    cy.location("pathname").should("include", "/account/applications")
    cy.signOut()
  })
})

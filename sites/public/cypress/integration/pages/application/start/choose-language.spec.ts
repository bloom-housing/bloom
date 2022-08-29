describe("applications/start/choose-language", function () {
  it("should redirect to create account page", function () {
    cy.visit("/listings")
    cy.get(".is-card-link").contains("Test: Coliseum").click()
    cy.getByTestId("listing-view-apply-button").eq(1).click()
    cy.getByTestId("app-choose-language-create-account-button").click()
    cy.location("pathname").should("equals", "/create-account")
  })
})

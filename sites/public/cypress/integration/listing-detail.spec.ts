describe("Individual listing page", () => {
  it("clicks into an individual listing page", () => {
    cy.visit("/listings")
    cy.contains("See Details").click()
    cy.contains("Listing Updated")
    cy.contains("Features")
    cy.contains("Neighborhood")
  })
})

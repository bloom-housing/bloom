describe("Individual listing page", () => {
  it("clicks into an individual listing page", () => {
    cy.visit("/listings")
    cy.contains("See Details").click()

    // Verify that the listing page has some data/headings that we expect it to have
    cy.contains("How to Apply")
    cy.contains("Features")
    cy.contains("Neighborhood")
  })
})

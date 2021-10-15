describe("Individual listing page", () => {
  it("clicks into an individual listing page", () => {
    cy.visit("/listings")
    cy.contains("See Details").click()

    // Verify that the listing page has some data/headings that we expect it to have.
    // NOTE: this assumes that the first listing in the group contains these features,
    // which may or may not hold true as new seed listings are added.
    // TODO: pick a particular listing to click on with known features.
    cy.contains("Management Company")
    cy.contains("Features")
    cy.contains("Neighborhood")
  })
})

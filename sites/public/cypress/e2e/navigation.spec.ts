describe("Site navigation", () => {
  it("should load the home page", () => {
    cy.visit("/")
    cy.getByTestId("hero-component").should("be.visible")
  })

  it("should load the listings page", () => {
    cy.visit("/listings")

    cy.getByTestId("listing-card-component").should("be.visible")
  })
})

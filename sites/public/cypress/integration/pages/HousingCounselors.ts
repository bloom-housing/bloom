describe("Housing counselors page", () => {
  it("renders the provided list of counselors", () => {
    cy.visit("/housing-counselors")
    cy.contains("Housing Counselors")
  })
})

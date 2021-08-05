describe("Housing counselors page", () => {
  it("renders the provided list of counselors", () => {
    cy.visit("/housing-counselors")
    cy.contains("Housing Counselors")
    // TODO(https://github.com/CityOfDetroit/bloom/issues/301): add verification of counselors.
  })
})

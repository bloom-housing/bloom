describe("New applications page", function () {
  it("renders the new application form", function () {
    cy.visit("/applications/start/choose-language")
    cy.get("form").should("have.length.of.at.least", 1)
    cy.get("h3.field-label--caps").contains("Choose Your Language")
  })
})

describe("New applications page", function () {
  it("renders the new application form", function () {
    cy.visit("/applications/start/choose-language")
    cy.get("h3.field-label--caps").contains("Choose Your Language")
  })
})

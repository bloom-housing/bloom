describe("Language selection", function () {
  it("should switch the page to Spanish when Spanish Language is selected", function () {
    cy.visit("/listings")
    cy.env(["showSeedsDesign"]).then(({ showSeedsDesign }) => {
      if (showSeedsDesign) {
        cy.getByTestId("English").click()

        cy.getByTestId("Español").click()
      } else {
        cy.contains("button", "Español").click()
      }
    })

    cy.url().should("include", "/es/")
    cy.contains("Listados").should("be.visible")
  })
})

describe("Our First Test", function() {
  it("Loads the public app's homepage", function() {
    cy.visit("http://localhost:3000")

    // Check that the "Hello World" text is present on the page
    cy.contains("affordable housing")

    // Find the About page link and click it
    cy.contains("Disclaimer").click()

    // Should be on a new URL which includes '/about'
    cy.url().should("include", "/disclaimer")
  })
})

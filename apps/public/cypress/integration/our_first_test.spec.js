describe('Our First Test', function() {
  it("Loads the public app's homepage", function() {
    cy.visit('http://localhost:3000')

    // Check that the "Hello World" text is present on the page
    cy.contains('Hello World')

    // Find the About page link and click it
    cy.contains('About').click()

    // Should be on a new URL which includes '/about'
    cy.url().should('include', '/about')
  })
})

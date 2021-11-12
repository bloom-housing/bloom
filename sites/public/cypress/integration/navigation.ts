describe("Navigating around the site", () => {
  it("Loads the homepage directly", () => {
    cy.visit("/")

    // Check that the homepage banner text is present on the page
    cy.contains("Find affordable housing")
  })

  it("Loads the listings page directly", () => {
    cy.visit("/listings")

    // Check that the listings page banner text is present on the page
    cy.contains("Rent affordable housing")
  })

  it("Loads a non-listing-related page directly", () => {
    cy.visit("/disclaimer")

    // Check that the Disclaimer page banner text is present on the page
    cy.contains("Endorsement Disclaimers")
  })

  it("Can navigate to all page types after initial site load", () => {
    cy.visit("/")

    // Click on the Disclaimer page link in the footer
    cy.get("footer a").contains("Disclaimer").click()

    // Should be on the disclaimer page
    cy.location("pathname").should("equal", "/disclaimer")
    cy.contains("Endorsement Disclaimers")

    // Click on the listings page link in the header nav
    cy.get(".navbar").contains("Log in").click()

    // Should be on the listings page
    cy.location("pathname").should("equal", "/sign-in")
    cy.contains("Sign In")

    // Click on the navbar logo to go to the homepage
    cy.get(".navbar")
      .first()
      .within(() => {
        cy.get(".logo").click()
      })

    // Check that the homepage banner text is present on the page
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`)
    cy.contains("Find affordable housing")
  })
})

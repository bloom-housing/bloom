describe("Navigating around the site", () => {
  it("Loads the homepage directly", () => {
    cy.visit("/")

    // Check that the homepage banner text is present on the page
    cy.contains("Apply for affordable housing")
  })

  it("Loads the listings page directly", () => {
    cy.visit("/listings")

    // Check that the listings page banner text is present on the page
    cy.contains("Rent affordable housing")
  })

  it("Loads a listing page directly by id", () => {
    cy.visit("/listing/Uvbk5qurpB2WI9V6WnNdH")

    // Check that the listing page sidebar apply section text is present on the page
    cy.contains("Get a Paper Application")

    // Check that the URL got re-written with a URL slug
    cy.location("pathname").should(
      "eq",
      "/listing/Uvbk5qurpB2WI9V6WnNdH/archer_studios_98_archer_street_san_jose_ca"
    )
  })

  it("Loads a listing page directly with a full url", () => {
    cy.visit("/listing/Uvbk5qurpB2WI9V6WnNdH/archer_studios_98_archer_street_san_jose_ca")

    // Check that the listing page sidebar apply section text is present on the page
    cy.contains("Get a Paper Application")
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
    cy.get(".navbar").contains("Listings").click()

    // Should be on the listings page
    cy.location("pathname").should("equal", "/listings")
    cy.contains("Rent affordable housing")

    // Click on a listing item on the listings page
    cy.get("article")
      .first()
      .within(() => {
        cy.get("a").last().click()
      })

    // Should be on the listing page
    cy.location("pathname").should("include", "/listing/")
    cy.contains("Get a Paper Application")

    // Click on the navbar logo to go to the homepage
    cy.get(".navbar")
      .first()
      .within(() => {
        cy.get(".logo").click()
      })

    // Check that the homepage banner text is present on the page
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`)
    cy.contains("Apply for affordable housing")
  })
})

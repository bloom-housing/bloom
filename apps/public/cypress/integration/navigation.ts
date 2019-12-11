describe("Navigating around the site", function() {
  it("Loads the homepage directly", function() {
    cy.visit("http://localhost:3000")

    // Check that the homepage banner text is present on the page
    cy.contains("Apply for affordable housing")
  })

  it("Loads the listings page directly", function() {
    cy.visit("http://localhost:3000/listings")

    // Check that the listings page banner text is present on the page
    cy.contains("Rent affordable housing")
  })

  it("Loads a listing page directly", function() {
    cy.visit("http://localhost:3000/listing/Uvbk5qurpB2WI9V6WnNdH")

    // Check that the listing page sidebar apply section text is present on the page
    cy.contains("Get a Paper Application")
  })

  it("Loads a non-listing-related page directly", function() {
    cy.visit("http://localhost:3000/disclaimer")

    // Check that the Disclaimer page banner text is present on the page
    cy.contains("Endorsement Disclaimers")
  })

  it("Can navigate to all page types after initial site load", function() {
    cy.visit("http://localhost:3000")

    // Click on the Disclaimer page link in the footer
    cy.get("footer a")
      .contains("Disclaimer")
      .click()

    // Should be on the disclaimer page
    cy.location("pathname").should("equal", "/disclaimer")
    cy.contains("Endorsement Disclaimers")

    // Click on the listings page link in the header nav
    cy.get(".navbar")
      .contains("Listings")
      .click()

    // Should be on the listings page
    cy.location("pathname").should("equal", "/listings")
    cy.contains("Rent affordable housing")

    // Click on a listing item on the listings page
    cy.get("article")
      .first()
      .within(() => {
        cy.get("a")
          .last()
          .click()
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
    cy.url().should("eq", "http://localhost:3000/")
    cy.contains("Apply for affordable housing")
  })
})

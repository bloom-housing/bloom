describe("My favorites page", function () {
  // TODO: reenable once we have Seeds pages in production & CI builds
  it.skip("renders the my favorites page", function () {
    cy.visit("/sign-in")
    cy.signIn()
    cy.url().should("include", "/account/dashboard")
    cy.getByID("account-dashboard-favorites").click()
    cy.location("pathname").should("include", "/account/favorites")
    cy.get(".seeds-card").should("have.length", 0)

    // Favorite a listing
    cy.visit("/listings")
    cy.get(".seeds-card").first().click()
    cy.getByID("favorite-button-section").find("button").click()

    // Verify favorited listing
    cy.visit("/account/favorites")
    cy.get(".seeds-card").should("have.length", 1)
    cy.get(".seeds-card").first().click()
    cy.location("pathname").should("include", "/listing/")

    // Remove listing
    cy.getByID("favorite-button-section").find("button").click()
    cy.visit("/account/favorites")
    cy.get(".seeds-card").should("have.length", 0)

    cy.signOut()
  })
})

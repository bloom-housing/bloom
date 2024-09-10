describe("Lottery Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("can run through every lottery action", () => {
    const uniqueListingName = Date.now().toString()

    cy.visit("/")
    cy.addMinimalListing(uniqueListingName, true, false, true)
    cy.addMinimalApplication(uniqueListingName)

    // Close the listing and view lottery tab
    cy.visit("/")
    cy.contains("Listings")
    cy.getByTestId("ag-search-input").type(uniqueListingName)
    cy.getByTestId(uniqueListingName).first().click()
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByID("closeButton").contains("Close").click()
    cy.getByID("close-listing-modal-button").contains("Close").click()
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("No lottery data")

    // Run lottery
    cy.getByID("lottery-run-button").click()
    cy.getByID("lottery-run-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Re-run lottery
    cy.getByID("lottery-rerun-button").click()
    cy.getByID("lottery-rerun-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Release lottery
    cy.getByID("lottery-release-button").click()
    cy.getByID("lottery-release-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Add partner to this listing
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.contains("Users")
    cy.getByTestId("ag-search-input").type("partner-user@example.com")
    cy.getByID("user-link-partner@example.com").first().click()
    cy.getByTestId("listings-all-Bay Area").check({ force: true })
    cy.getByID("save-user").click()

    // Login as partner and view lottery tab
    cy.signOut()
    cy.login("partnerUser")
    cy.visit("/")
    cy.contains("Listings")
    cy.getByTestId("ag-search-input").type(uniqueListingName)
    cy.getByTestId(uniqueListingName).first().click()
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("Publish lottery data")

    // Publish the lottery
    cy.getByID("lottery-publish-button").click()
    cy.getByID("lottery-publish-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Login as admin and view lottery tab
    cy.signOut()
    cy.login()
    cy.visit("/")
    cy.contains("Listings")
    cy.getByTestId("ag-search-input").type(uniqueListingName)
    cy.getByTestId(uniqueListingName).first().click()
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("Export lottery data")

    // Retract lottery
    cy.getByID("lottery-retract-button").click()
    cy.getByID("lottery-retract-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Login as partner and view lottery tab, ensure no data
    cy.signOut()
    cy.login("partnerUser")
    cy.visit("/")
    cy.contains("Listings")
    cy.getByTestId("ag-search-input").type(uniqueListingName)
    cy.getByTestId(uniqueListingName).first().click()
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("No lottery data")
  })
})

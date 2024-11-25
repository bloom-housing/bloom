describe("Lottery Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("can run through every lottery action", () => {
    const uniqueListingName = Date.now().toString()
    cy.intercept("POST", "https://api.cloudinary.com/v1_1/exygy/upload", {
      fixture: "cypressUpload",
    })
    cy.intercept(
      "GET",
      "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg.jpg",
      {
        fixture: "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg",
      }
    )
    cy.visit("/")
    cy.addMinimalListing(uniqueListingName, true, false, true)
    cy.addMinimalApplication(uniqueListingName)

    // Close the listing and view lottery tab
    cy.findAndOpenListing(uniqueListingName)
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
    cy.getByTestId("ag-search-input")
      .should("be.visible")
      .type("partner-user@example.com", { force: true })
    cy.getByID("user-link-partner@example.com").first().click()
    cy.getByTestId("listings-all-Bay Area").check({ force: true })
    cy.getByID("save-user").click()

    // Login as partner and view lottery tab
    cy.signOut()
    cy.login("partnerUser")
    cy.findAndOpenListing(uniqueListingName)
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("Publish lottery data")

    // Publish the lottery
    cy.getByID("lottery-publish-button").click()
    cy.getByID("lottery-publish-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Login as admin and view lottery tab
    cy.signOut()
    cy.login()
    cy.findAndOpenListing(uniqueListingName)
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("Export lottery data")

    // Retract lottery
    cy.getByID("lottery-retract-button").click()
    cy.getByID("lottery-retract-modal-button").click()
    cy.get("h2").contains("Export lottery data")

    // Login as partner and view lottery tab, ensure no data
    cy.signOut()
    cy.login("partnerUser")
    cy.findAndOpenListing(uniqueListingName)
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("No lottery data")
  })
})

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

    // Create and publish minimal lottery listing
    cy.getByID("addListingButton").contains("Add Listing").click()
    cy.contains("New Listing")
    cy.fixture("minimalListing").then((listing) => {
      cy.getByID("jurisdictions.id").select("Bloomington")
      cy.getByID("jurisdictions.id-error").should("have.length", 0)
      cy.getByID("name").type(uniqueListingName)
      cy.getByID("developer").type(listing["developer"])
      cy.getByID("add-photos-button").contains("Add Photo").click()
      cy.getByTestId("dropzone-input").attachFile(
        "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg",
        {
          subjectType: "drag-n-drop",
        }
      )
      cy.getByTestId("drawer-photos-table")
        .find("img")
        .should("have.attr", "src")
        .should("include", "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96")
      cy.getByID("listing-photo-uploaded").contains("Save").click()
      cy.getByID("listingsBuildingAddress.street").type(listing["buildingAddress.street"])
      cy.getByID("neighborhood").type(listing["neighborhood"])
      cy.getByID("listingsBuildingAddress.city").type(listing["buildingAddress.city"])
      cy.getByID("listingsBuildingAddress.state").select(listing["buildingAddress.state"])
      cy.getByID("listingsBuildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
      cy.getByID("addUnitsButton").contains("Add Unit").click()
      cy.getByID("number").type(listing["number"])
      cy.getByID("unitTypes.id").select(listing["unitType.id"])
      cy.getByID("unitFormSaveAndExitButton").contains("Save & Exit").click()
      cy.getByID("amiChart.id").select(1).trigger("change")
      cy.getByID("amiPercentage").select(1)
      cy.getByID("unitFormSaveAndExitButton").contains("Save & Exit").click()
      cy.get("button").contains("Application Process").click()
      cy.getByID("reviewOrderLottery").check()
      cy.getByTestId("lottery-start-date-month").type("12")
      cy.getByTestId("lottery-start-date-day").type("17")
      cy.getByTestId("lottery-start-date-year").type("2026")
      cy.getByTestId("lottery-start-time-hours").type("10")
      cy.getByTestId("lottery-start-time-minutes").type("00")
      cy.getByTestId("lottery-start-time-period").select("AM")
      cy.getByTestId("lottery-end-time-hours").type("11")
      cy.getByTestId("lottery-end-time-minutes").type("00")
      cy.getByTestId("lottery-end-time-period").select("AM")
      cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
      cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
      cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
      cy.getByID("digitalApplicationChoiceYes").check()
      cy.getByID("commonDigitalApplicationChoiceYes").check()
      cy.getByID("paperApplicationNo").check()
      cy.getByID("referralOpportunityNo").check()
    })
    cy.getByID("publishButton").contains("Publish").click()
    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.get("[data-testid=page-header]").should("be.visible")
    cy.getByTestId("page-header").should("have.text", uniqueListingName)

    // Submit one application
    cy.visit("/")
    cy.getByTestId(`listing-status-cell-${uniqueListingName}`).click()
    cy.getByID("addApplicationButton").contains("Add Application").click()
    cy.fixture("applicantOnlyData").then((application) => {
      cy.fillPrimaryApplicant(application, [
        "application.additionalPhoneNumber",
        "application.additionalPhoneNumberType",
        "application.applicant.address.street2",
      ])
    })
    cy.getByID("submitApplicationButton").click()

    // Close the listing and view lottery tab
    cy.visit("/")
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
    cy.getByTestId("ag-search-input").type("partner-user@example.com")
    cy.getByID("user-link-partner@example.com").first().click()
    cy.getByTestId("listings-all-Bloomington").check()
    cy.getByID("save-user").click()

    // Login as partner and view lottery tab
    cy.signOut()
    cy.login("partnerUser")
    cy.visit("/")
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
    cy.getByTestId("ag-search-input").type(uniqueListingName)
    cy.getByTestId(uniqueListingName).first().click()
    cy.get(`[role="tab"]`).eq(2).click()
    cy.get("h2").contains("No lottery data")
  })
})

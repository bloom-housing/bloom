describe("Listings approval feature", () => {
  const uniqueListingName = Date.now().toString()
  const uniqueListingNameEdited = `${uniqueListingName} edited`
  it("should allow for pending submission, requested changes, and approval", () => {
    cy.intercept("/api/adapter/upload", {
      body: {
        id: "123",
        url: "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg",
      },
    })
    // Partner: Submit a listing for approval
    cy.login("jurisdictionalAdminUser")
    cy.visit("/")
    cy.getByID("addListingButton").contains("Add Listing").click()
    cy.contains("New Listing")
    cy.fixture("minimalListing").then((listing) => {
      fillOutMinimalListing(cy, listing)
    })
    cy.getByID("listing-status-pending-review").should("be.visible")
    cy.signOut()

    // Admin: Request changes
    cy.login("user")
    searchAndOpenListing(cy, uniqueListingName)
    cy.getByID("listing-status-pending-review").should("be.visible")
    cy.getByID("listingEditButton").click()
    cy.getByID("requestChangesButton").click()
    cy.getByTestId("requestedChanges").type("Requested changes test summary")
    cy.getByID("requestChangesButtonConfirm").click()
    cy.getByID("listing-status-changes-requested").should("be.visible")
    cy.signOut()

    // Partner: Can see the requested changes, edit the listing, and resubmit for approval
    cy.login("jurisdictionalAdminUser")
    searchAndOpenListing(cy, uniqueListingName)
    cy.getByID("listing-status-changes-requested").should("be.visible")
    cy.getByID("requestedChanges").contains("Requested changes test summary")
    cy.getByID("requestedChangesUser").contains("First Last")
    cy.getByID("listingEditButton").click()
    cy.getByTestId("nameField").should("be.visible").click().clear().type(uniqueListingNameEdited)
    cy.getByID("submitButton").contains("Submit").click()
    cy.getByID("submitListingForApprovalButtonConfirm").contains("Submit").click()
    cy.getByTestId("page-header").should("have.text", uniqueListingNameEdited)
    cy.signOut()

    // Admin: Approve and publish
    cy.login("user")
    searchAndOpenListing(cy, uniqueListingNameEdited)
    cy.getByID("listingEditButton").click()
    cy.getByID("saveAndExitButton").should("be.visible")
    cy.getByID("listing-status-pending-review").should("be.visible")
    cy.getByID("approveAndPublishButton").click()
    cy.getByID("listing-status-active").should("be.visible")
    cy.signOut()
  })

  function searchAndOpenListing(cy: Cypress.cy, name: string): void {
    cy.getByTestId("ag-search-input").type(name)
    cy.getByTestId(name).click()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fillOutMinimalListing(cy: Cypress.cy, listing: any): void {
    cy.getByID("name").type(uniqueListingName)
    cy.getByID("developer").type(listing["developer"])
    // Test photo upload
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
      .should(
        "include",
        "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg"
      )
    cy.getByID("listing-photo-uploaded").contains("Save").click()
    cy.getByTestId("photos-table")
      .find("img")
      .should("have.attr", "src")
      .should(
        "include",
        "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg"
      )

    cy.getByID("listingsBuildingAddress.street").type(listing["buildingAddress.street"])
    cy.getByID("neighborhood").type(listing["neighborhood"])
    cy.getByID("listingsBuildingAddress.city").type(listing["buildingAddress.city"])
    cy.getByID("listingsBuildingAddress.state").select(listing["buildingAddress.state"])
    cy.getByID("listingsBuildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
    cy.getByID("listingsBuildingAddress.county").type(listing["buildingAddress.county"])

    cy.getByID("addUnitsButton").contains("Add Unit").click()
    cy.getByID("number").type(listing["number"])
    cy.getByID("unitTypes.id").select(listing["unitType.id"])
    cy.getByID("unitFormSaveAndExitButton").contains("Save & Exit").click()
    cy.getByID("amiChart.id").select(1).trigger("change")
    cy.getByID("amiPercentage").select(1)
    cy.getByID("unitFormSaveAndExitButton").contains("Save & Exit").click()
    cy.get("button").contains("Application Process").click()

    cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
    cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
    cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
    cy.getByID("digitalApplicationChoiceYes").check()
    cy.getByID("commonDigitalApplicationChoiceYes").check()
    cy.getByID("paperApplicationNo").check()

    cy.getByID("submitButton").contains("Submit").click()

    cy.getByID("submitListingForApprovalButtonConfirm").contains("Submit").click()
    cy.getByTestId("page-header").should("be.visible")
    cy.getByTestId("page-header").should("have.text", uniqueListingName)
  }
})

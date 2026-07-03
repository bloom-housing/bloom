describe("Listings autopublish feature", () => {
  const futurePublishDate = new Date()
  futurePublishDate.setFullYear(futurePublishDate.getFullYear() + 1)

  const uniqueListingName = `autopublish-${Date.now()}`
  const adminDraftListingName = `autopublish-admin-draft-${Date.now()}`

  it("should approve to scheduled and publish from scheduled with autopublish enabled", () => {
    cy.intercept("POST", "https://api.cloudinary.com/v1_1/exygy/upload", {
      fixture: "cypressUpload",
    })
    cy.intercept(
      "GET",
      "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpg",
      {
        fixture: "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpg",
      }
    )

    cy.loginApi("user")
    cy.visit("/")

    // Create a name-only draft listing in Angelopolis as admin
    cy.visit("/")
    cy.getByID("addListingButton").contains("Add listing").click()
    cy.getByID("jurisdiction").select("Angelopolis")
    cy.get("button").contains("Get started").click()
    cy.contains("New listing")
    cy.getByID("name").type(adminDraftListingName)
    cy.getByID("saveDraftButton").contains("Save as draft").click()
    cy.getByTestId("page-header").should("have.text", adminDraftListingName)

    // Give partner user listing access in Angelopolis
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.contains("Users")
    cy.getByTestId("ag-search-input")
      .should("be.visible")
      .type("partner@example.com", { force: true })
    cy.getByID("user-link-partner@example.com").first().click()

    // Ensure Angelopolis is selected as a partner jurisdiction so listing checkboxes render
    cy.get("body").then(($body) => {
      if ($body.find("[data-testid='listings-all-Angelopolis']").length === 0) {
        cy.contains("label", "Angelopolis").click({ force: true })
      }
    })
    cy.getByTestId("listings-all-Angelopolis").should("exist")
    cy.getByTestId("listings-all-Angelopolis").check({ force: true })
    cy.getByID("save-user").click()
    cy.signOutApi("user")

    cy.loginApi("partnerUser")
    cy.visit("/")

    // Submit scheduled listing for approval
    cy.addMinimalListing(
      uniqueListingName,
      false,
      true,
      false,
      futurePublishDate,
      adminDraftListingName
    )
    cy.getByID("listing-status-pending-review").should("be.visible")
    cy.signOutApi("partnerUser")

    // Approve listing to move to scheduled
    cy.loginApi("user")
    cy.visit("/")
    cy.findAndOpenListing(uniqueListingName)
    cy.getByID("approveAndPublishButton").click()
    cy.getByID("adminListingApprovalButtonConfirm").click()

    cy.findAndOpenListing(uniqueListingName)
    cy.getByID("listing-status-scheduled").should("be.visible")

    // Override scheduling and publish
    cy.getByID("publishScheduledButton").click()
    cy.getByID("publishScheduledListingButtonConfirm").click()

    cy.findAndOpenListing(uniqueListingName)
    cy.getByID("listing-status-active").should("be.visible")
    cy.signOutApi()
  })
})

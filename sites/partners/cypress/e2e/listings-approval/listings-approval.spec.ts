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

    cy.addMinimalListing(uniqueListingName, false, true, false)
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
    cy.getByID("saveAndContinueButton").should("be.visible")
    cy.getByID("listing-status-pending-review").should("be.visible")
    cy.getByID("approveAndPublishButton").click()
    cy.getByID("listing-status-active").should("be.visible")
    cy.signOut()
  })

  function searchAndOpenListing(cy: Cypress.cy, name: string): void {
    cy.getByTestId("ag-search-input").type(name)
    cy.getByTestId(name).click()
  }
})

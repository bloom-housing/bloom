describe("Listing Management Tests", () => {
  beforeEach(() => {
    cy.loginApi()
  })

  after(() => {
    cy.signOutApi()
  })

  it("error messaging & save dialogs", () => {
    // Test to check that the appropriate error messages happen on submit
    cy.visit("/")
    cy.get("a").contains("Add Listing").click()
    cy.contains("New Listing")
    // Save an empty listing as a draft and should show errors for appropriate fields
    cy.getByID("saveDraftButton").contains("Save as Draft").click()
    cy.contains("Please resolve any errors before saving or publishing your listing.")
    cy.getByID("name-error").contains("This field is required")
    cy.getByID("jurisdictions.id-error").contains("This field is required")
    // Fill out minimum fields and errors get removed
    cy.getByID("jurisdictions.id").select("Bay Area")
    cy.getByID("jurisdictions.id-error").should("not.include.text", "This field is required")
    cy.getByID("name").type("Test - error messaging")
    cy.getByID("name-error").should("to.be.empty")
    cy.getByID("saveDraftButton").contains("Save as Draft").click()
    cy.contains("Test - error messaging")
    cy.contains("Listing Data")
    // Try to publish a listing and should show errors for appropriate fields
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByID("reservedCommunityTypes.id").select(1)
    cy.getByID("includeCommunityDisclaimerYes").check()
    cy.getByID("publishButton").contains("Publish").click()
    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.contains("Please resolve any errors before saving or publishing your listing.")
    cy.getByID("developer-error").contains("This field is required")
    cy.getByID("photos-error").contains("This field is required")
    cy.getByID("listingsBuildingAddress.street-error").contains("Cannot enter a partial address")
    cy.getByID("listingsBuildingAddress.city-error").contains("Cannot enter a partial address")
    cy.getByID("listingsBuildingAddress.state-error").contains("Cannot enter a partial address")
    cy.getByID("listingsBuildingAddress.zipCode-error").contains("Cannot enter a partial address")
    cy.get(`[data-variant="alert"`).should(($alertButtons) => {
      expect($alertButtons).to.have.length(2)
      expect($alertButtons[0]).to.have.id("add-photos-button")
      expect($alertButtons[1]).to.have.id("addUnitsButton")
    })
    cy.getByID("units-error").contains("This field is required")
    cy.getByID("communityDisclaimerTitle-error").contains("This field is required")
    cy.get(".textarea-error-message").contains("This field is required")
    cy.getByID("applicationProcessButton").contains("Application Process").click()
    cy.getByID("leasingAgentName-error").contains("This field is required")
    cy.getByID("leasingAgentEmail-error").contains("This field is required")
    cy.getByID("leasingAgentPhone-error").contains("This field is required")
    cy.getByID("digitalApplicationChoice-error").contains("This field is required")
    cy.getByID("paperApplicationChoice-error").contains("This field is required")
    // Verify the behavior of Exit discard & confirm
    cy.contains("Listing Details").click()
    cy.getByID("name").clear()
    cy.getByID("name").type("Test - error messaging DISCARD")
    cy.getByID("listingsExitButton").click()
    cy.getByID("listing-save-before-exit-dialog-content").contains(
      "Do you want to save your changes before you exit?"
    )
    cy.getByID("saveBeforeExitDiscard").click()
    cy.contains("Test - error messaging")
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByID("name").clear()
    cy.getByID("name").type("Test - error messaging DISCARD")
    cy.getByID("listingsExitButton").click()
    cy.getByID("saveBeforeExitConfirm").click()
    cy.contains("Test - error messaging DISCARD")
    // Test save button
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByID("saveAndContinueButton").contains("Save").click()
    cy.getByID("name").should("have.value", "Test - error messaging DISCARD")
  })

  it.skip("error messaging publish with minimal fields", () => {
    cy.visit("/")
    cy.get("a").contains("Add Listing").click()
    cy.contains("New Listing")
    cy.getByID("jurisdictions.id").select("Lakeview")
    // Try to publish a listing and should show errors for appropriate fields
    cy.getByID("publishButton").contains("Publish").click()
    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.contains("Please resolve any errors before saving or publishing your listing.")
    cy.getByID("name-error").contains("This field is required")
    cy.getByID("developer-error").contains("This field is required").should("not.exist")
    cy.getByID("listingsBuildingAddress.street-error").contains("Cannot enter a partial address")
    cy.getByID("listingsBuildingAddress.city-error").contains("Cannot enter a partial address")
    cy.getByID("listingsBuildingAddress.state-error").contains("Cannot enter a partial address")
    cy.getByID("listingsBuildingAddress.zipCode-error").contains("Cannot enter a partial address")
    cy.getByID("units-error").should("not.exist")
    cy.getByID("applicationProcessButton").contains("Application Process").click()
    cy.getByID("leasingAgentName-error").contains("This field is required").should("not.exist")
    cy.getByID("leasingAgentEmail-error").contains("This field is required").should("not.exist")
    cy.getByID("leasingAgentPhone-error").should("not.exist")
    cy.getByID("digitalApplicationChoice-error").should(
      "not.include.text",
      "This field is required"
    )
    cy.getByID("paperApplicationChoice-error").should("not.include.text", "This field is required")
    cy.getByID("referralOpportunityChoice-error").should(
      "not.include.text",
      "This field is required"
    )
  })

  it("full listing publish", () => {
    cy.intercept("POST", "/api/adapter/upload", {
      body: {
        id: "123",
        url: "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg",
      },
    })
    cy.visit("/")
    cy.get("a").contains("Add Listing").click()
    cy.contains("New Listing")
    cy.fixture("listing").then((listing) => {
      fillOutListing(cy, listing)
      verifyDetails(cy, listing)
      verifyAutofill(cy, listing)
      verifyOpenListingWarning(cy, listing)
    })
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fillOutListing(cy: Cypress.cy, listing: any): void {
    cy.intercept("GET", "/geocoding/v5/**", { fixture: "address" })
    cy.intercept("POST", "https://api.cloudinary.com/v1_1/exygy/upload", {
      fixture: "cypressUpload",
    })
    cy.intercept(
      "GET",
      "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpg",
      {
        fixture: "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg",
      }
    )
    cy.getByID("jurisdictions.id").select(listing["jurisdiction.id"])
    cy.getByID("name").type(listing["name"])
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

    cy.intercept("POST", "https://api.cloudinary.com/v1_1/exygy/upload", {
      public_id: "dev/cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08",
    })
    cy.intercept(
      "GET",
      "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08.jpg",
      {
        fixture: "cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08.jpg",
      }
    )
    cy.getByID("add-photos-button").contains("Edit Photos").click()
    cy.getByTestId("dropzone-input").attachFile(
      "cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08.jpg",
      {
        subjectType: "drag-n-drop",
      }
    )
    cy.intercept("/api/adapter/upload", {
      body: {
        id: "123",
        url: "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fd24fe68d7d2422b6297ed4_Frame%2085.svg",
      },
    })
    cy.getByTestId("drawer-photos-table")
      .find("img")
      .eq(1)
      .should("have.attr", "src")
      .should(
        "include",
        "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fd24fe68d7d2422b6297ed4_Frame%2085.svg"
      )
    cy.getByID("listing-photo-uploaded").contains("Save").click()
    cy.getByTestId("photos-table")
      .find("img")
      .eq(1)
      .should("have.attr", "src")
      .should(
        "include",
        "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fd24fe68d7d2422b6297ed4_Frame%2085.svg"
      )
    cy.getByTestId("photos-table").get("tbody > tr").should("have.length", 2)
    cy.getByTestId("photos-table")
      .get("tbody > tr:nth-of-type(2)")
      .should("not.contain", "Primary photo")
    cy.getByID("listingsBuildingAddress.street").type(listing["buildingAddress.street"])
    cy.getByID("neighborhood").type(listing["neighborhood"])
    cy.getByID("listingsBuildingAddress.city").type(listing["buildingAddress.city"])
    cy.getByID("listingsBuildingAddress.county").select(listing["buildingAddress.county"])
    cy.getByID("listingsBuildingAddress.state").select(listing["buildingAddress.state"])
    cy.getByID("listingsBuildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
    cy.getByID("yearBuilt").type(listing["yearBuilt"])
    cy.get(".addressPopup").contains(listing["buildingAddress.street"])
    cy.getByID("reservedCommunityTypes.id").select(listing["reservedCommunityType.value"])
    cy.getByID("reservedCommunityDescription").type(listing["reservedCommunityDescription"])
    cy.getByID("includeCommunityDisclaimerYes").check()
    cy.getByID("communityDisclaimerTitle").type(listing["communityDisclaimerTitle"])
    cy.getByID("communityDisclaimerDescription").type(listing["communityDisclaimerDescription"])
    cy.getByTestId("unit-types").check()
    cy.getByTestId("listingAvailability.availableUnits").check()
    if (listing["homeType"]) {
      cy.getByID("homeType").select(listing["homeType"])
    }
    cy.getByID("addUnitsButton").contains("Add Unit").click()
    cy.getByID("number").type(listing["number"])
    cy.getByID("unitTypes.id").select(listing["unitType.id"])
    cy.getByID("numBathrooms").select(listing["numBathrooms"])
    cy.getByID("floor").select(listing["floor"])
    cy.getByID("sqFeet").type(listing["sqFeet"])
    cy.getByID("minOccupancy").select(listing["minOccupancy"])
    cy.getByID("maxOccupancy").select(listing["maxOccupancy"])
    cy.getByID("fixed").check({ force: true })
    cy.getByID("monthlyIncomeMin").type(listing["monthlyIncomeMin"])
    cy.getByID("monthlyRent").type(listing["monthlyRent"])
    cy.getByID("unitAccessibilityPriorityTypes.id").select(listing["priorityType.id"])
    cy.get("button").contains("Save & Exit").click()
    cy.getByID("amiChart.id").select(1).trigger("change")
    cy.getByID("amiPercentage").select(1)
    cy.get("button").contains("Save & Exit").click()
    cy.get("#add-preferences-button").contains("Add Preference").click()
    cy.get(".seeds-card-section > .seeds-button").contains("Select Preferences").click()
    cy.get(
      ":nth-child(1) > .seeds-grid > .seeds-grid-row > .seeds-grid-cell > .field > div > .label"
    )
      .contains("Work in the city")
      .click()
    cy.getByID("addPreferenceSaveButton").contains("Save").click()
    cy.getByID("selectAndOrderSaveButton").contains("Save").click()
    cy.getByID("applicationFee").type(listing["applicationFee"])
    cy.getByID("depositMin").clear().type(listing["depositMin"])
    cy.getByID("depositMax").clear().type(listing["depositMax"])
    cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
    if (listing["utilities"]) {
      listing["utilities"].forEach((utility: string) => {
        cy.getByID(utility.toLowerCase()).check()
      })
    }
    cy.getByID("amenities").type(listing["amenities"])
    cy.getByID("accessibility").type(listing["accessibility"])
    cy.getByID("unitAmenities").type(listing["unitAmenities"])
    cy.getByID("smokingPolicy").type(listing["smokingPolicy"])
    cy.getByID("petPolicy").type(listing["petPolicy"])
    cy.getByID("servicesOffered").type(listing["servicesOffered"])
    if (listing["accessibilityFeatures"]) {
      listing["accessibilityFeatures"].forEach((feature: string[]) => {
        cy.getByID(feature[0]).check()
      })
    }
    cy.getByID("creditHistory").type(listing["creditHistory"])
    cy.getByID("rentalHistory").type(listing["rentalHistory"])
    cy.getByID("criminalBackground").type(listing["criminalBackground"])
    cy.getByID("addBuildingSelectionCriteriaButton")
      .contains("Add Building Selection Criteria")
      .click()
    cy.getByID("criteriaAttachTypeURL").check()
    cy.getByID("buildingSelectionCriteriaURL").type(listing["buildingSelectionCriteriaURL"])
    cy.getByID("saveBuildingSelectionCriteriaButton").contains("Save").click()
    cy.getByID("requiredDocuments").type(listing["requiredDocuments"])
    cy.getByID("programRules").type(listing["programRules"])
    cy.getByID("specialNotes").type(listing["specialNotes"])
    cy.get("button").contains("Application Process").click()
    cy.getByID("reviewOrderFCFS").check()
    cy.getByID("waitlistOpenNo").check()
    cy.getByID("whatToExpect").clear()
    cy.getByID("whatToExpect").type("Custom unformatted text")
    cy.getByID("whatToExpect").type("{enter}Item A")
    cy.getByID("editor-bullet-list").click()
    cy.getByID("whatToExpect").click()
    cy.getByID("whatToExpect").type("{enter}Item B{enter}Item C")
    cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
    cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
    cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
    cy.getByID("leasingAgentTitle").type(listing["leasingAgentTitle"])
    cy.getByID("leasingAgentOfficeHours").type(listing["leasingAgentOfficeHours"])
    cy.getByID("digitalApplicationChoiceYes").check()
    cy.getByID("commonDigitalApplicationChoiceNo").check()
    cy.getByID("customOnlineApplicationUrl").type(listing["url"])
    cy.getByID("paperApplicationNo").check()

    cy.getByID("listingsLeasingAgentAddress.street").type(listing["leasingAgentAddress.street"])
    cy.getByID("listingsLeasingAgentAddress.street2").type(listing["leasingAgentAddress.street2"])
    cy.getByID("listingsLeasingAgentAddress.city").type(listing["leasingAgentAddress.city"])
    cy.getByID("listingsLeasingAgentAddress.zipCode").type(listing["leasingAgentAddress.zipCode"])
    cy.getByID("listingsLeasingAgentAddress.state").select(listing["leasingAgentAddress.state"])

    cy.getByID("applicationsMailedInYes").check()
    cy.getByID("mailInAnotherAddress").check()
    cy.getByTestId("mailing-address-street").type(listing["leasingAgentAddress.street"])
    cy.getByTestId("mailing-address-street2").type(listing["leasingAgentAddress.street2"])
    cy.getByTestId("mailing-address-city").type(listing["leasingAgentAddress.city"])
    cy.getByTestId("mailing-address-zip").type(listing["leasingAgentAddress.zipCode"])
    cy.getByTestId("mailing-address-state").select(listing["leasingAgentAddress.state"])

    cy.getByID("applicationsPickedUpNo").check()
    cy.getByID("applicationsDroppedOffNo").check()
    cy.getByID("postmarksConsideredYes").check()
    cy.getByTestId("postmark-date-field-month").type("12")
    cy.getByTestId("postmark-date-field-day").type("17")
    cy.getByTestId("postmark-date-field-year").type("2022")
    cy.getByTestId("postmark-time-field-hours").type("5")
    cy.getByTestId("postmark-time-field-minutes").type("45")
    cy.getByTestId("postmark-time-field-period").select("PM")
    cy.getByID("additionalApplicationSubmissionNotes").type(
      listing["additionalApplicationSubmissionNotes"]
    )

    cy.getByID("addOpenHouseButton").contains("Add Open House").click()

    cy.getByID("date.month").type(listing["date.month"])
    cy.getByID("date.day").type(listing["date.day"])
    cy.getByID("date.year").type(listing["date.year"])
    cy.getByID("label").type(listing["label"])
    cy.getByID("url").type(listing["url"])
    cy.getByID("startTime.hours").type(listing["startTime.hours"])
    cy.getByID("startTime.minutes").type(listing["startTime.minutes"])
    cy.getByID("endTime.hours").type(listing["endTime.hours"])
    cy.getByID("endTime.minutes").type(listing["endTime.minutes"])
    cy.getByID("note").type(listing["note"])
    cy.getByID("startTime.period").select("AM")
    cy.getByID("endTime.period").select("PM")
    cy.getByID("saveOpenHouseFormButton").contains("Save").click()

    cy.getByID("applicationDueDateField.month").type(listing["date.month"])
    cy.getByID("applicationDueDateField.day").type(listing["date.day"])
    cy.getByID("applicationDueDateField.year").type((new Date().getFullYear() + 1).toString())
    cy.getByID("applicationDueTimeField.hours").type(listing["startTime.hours"])
    cy.getByID("applicationDueTimeField.minutes").type(listing["startTime.minutes"])
    cy.getByID("applicationDueTimeField.period").select("PM")
    cy.getByID("publishButton").contains("Publish").click()

    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.get("[data-testid=page-header]").should("be.visible")
    cy.getByTestId("page-header").should("have.text", listing["name"])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function verifyDetails(cy: Cypress.cy, listing: any): void {
    cy.findAndOpenListing(listing["name"])
    cy.getByID("jurisdictions.name").contains(listing["jurisdiction.id"])
    cy.getByID("name").contains(listing["name"])
    cy.getByID("developer").contains(listing["developer"])
    cy.get('[data-label="Preview"]')
      .find("img")
      .should("have.attr", "src")
      .should(
        "include",
        "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg"
      )
    cy.getByID("buildingAddress.street").contains(listing["buildingAddress.street"])
    cy.getByID("neighborhood").contains(listing.neighborhood)
    cy.getByID("neighborhood").contains(listing.neighborhood)
    cy.getByID("buildingAddress.city").contains(listing["buildingAddress.city"])
    cy.getByID("buildingAddress.county").contains(listing["buildingAddress.county"])
    cy.getByID("buildingAddress.state").contains("CA")
    cy.getByID("buildingAddress.zipCode").contains(listing["buildingAddress.zipCode"])
    cy.getByID("yearBuilt").contains(listing["yearBuilt"])
    cy.getByID("longitude").contains("-122")
    cy.getByID("latitude").contains("37.7")
    cy.getByID("reservedCommunityType").contains(listing["reservedCommunityType.id"])
    cy.getByID("reservedCommunityDescription").contains(listing["reservedCommunityDescription"])
    cy.getByID("includeCommunityDisclaimer").contains("Yes")
    cy.getByID("communityDisclaimerTitle").contains(listing["communityDisclaimerTitle"])
    cy.getByID("communityDisclaimerDescription").contains(listing["communityDisclaimerDescription"])
    if (listing["homeType"]) {
      cy.getByID("homeType").contains(listing["homeType"])
    }
    cy.getByTestId("unit-types-or-individual").contains("Unit Types")
    cy.getByTestId("listing-availability-question").contains("Available Units")
    cy.getByID("unitTable").contains(listing["number"])
    cy.getByID("unitTable").contains(listing["monthlyRent"])
    cy.getByID("unitTable").contains(listing["sqFeet"])
    cy.getByID("unitTable").contains(listing["priorityType.id"])
    cy.getByID("preferenceTable").contains("1")
    cy.getByID("preferenceTable").contains("Work in the city")
    cy.getByID("preferenceTable").contains("At least one member of my household works in the city")
    cy.getByID("applicationFee").contains(listing["applicationFee"])
    cy.getByID("depositMin").contains(listing["depositMin"])
    cy.getByID("depositMax").contains(listing["depositMax"])
    cy.getByID("costsNotIncluded").contains(listing["costsNotIncluded"])
    if (listing["utilities"]) {
      listing["utilities"].forEach((utility: string) => {
        cy.getByID("utilities").contains(utility)
      })
    }
    cy.getByID("amenities").contains(listing["amenities"])
    cy.getByID("unitAmenities").contains(listing["unitAmenities"])
    cy.getByID("accessibility").contains(listing["accessibility"])
    cy.getByID("smokingPolicy").contains(listing["smokingPolicy"])
    cy.getByID("petPolicy").contains(listing["petPolicy"])
    cy.getByID("servicesOffered").contains(listing["servicesOffered"])
    if (listing["accessibilityFeatures"]) {
      listing["accessibilityFeatures"].forEach((feature: string[]) => {
        cy.getByID("accessibilityFeatures").contains(feature[1])
      })
    }
    cy.getByID("creditHistory").contains(listing["creditHistory"])
    cy.getByID("rentalHistory").contains(listing["rentalHistory"])
    cy.getByID("criminalBackground").contains(listing["criminalBackground"])
    cy.getByID("rentalAssistance").contains(
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy."
    )
    cy.getByID("buildingSelectionCriteriaTable").contains(listing["buildingSelectionCriteriaURL"])
    cy.getByID("requiredDocuments").contains(listing["requiredDocuments"])
    cy.getByID("programRules").contains(listing["programRules"])
    cy.getByID("specialNotes").contains(listing["specialNotes"])
    cy.getByID("reviewOrderQuestion").contains("First come first serve")
    cy.getByID("whatToExpect").contains("Custom unformatted text")
    cy.getByID("whatToExpect").contains("li", "Item A")
    cy.getByID("whatToExpect").contains("li", "Item B")
    cy.getByID("whatToExpect").contains("li", "Item C")
    cy.getByID("leasingAgentName").contains(listing["leasingAgentName"])
    cy.getByID("leasingAgentEmail").contains(listing["leasingAgentEmail"].toLowerCase())
    cy.getByID("leasingAgentPhone").contains("(520) 245-8811")
    cy.getByID("leasingAgentOfficeHours").contains(listing["leasingAgentOfficeHours"])
    cy.getByID("leasingAgentTitle").contains(listing["leasingAgentTitle"])
    cy.getByID("digitalApplication").contains("Yes")
    cy.getByID("digitalMethod.type").contains("No")
    cy.getByID("customOnlineApplicationUrl").contains(listing["url"])
    cy.getByID("paperApplication").contains("No")
    cy.getByID("leasingAgentAddress.street").contains(listing["leasingAgentAddress.street"])
    cy.getByID("leasingAgentAddress.street2").contains(listing["leasingAgentAddress.street2"])
    cy.getByID("leasingAgentAddress.city").contains(listing["leasingAgentAddress.city"])
    cy.getByID("leasingAgentAddress.state").contains("CA")
    cy.getByID("leasingAgentAddress.zipCode").contains(listing["leasingAgentAddress.zipCode"])
    cy.getByID("applicationPickupQuestion").contains("No")
    cy.getByID("applicationMailingSection").contains("Yes")
    cy.getByTestId("applicationMailingAddress.street").contains(
      listing["leasingAgentAddress.street"]
    )
    cy.getByTestId("applicationMailingAddress.street2").contains(
      listing["leasingAgentAddress.street2"]
    )
    cy.getByTestId("applicationMailingAddress.city").contains(listing["leasingAgentAddress.city"])
    cy.getByTestId("applicationMailingAddress.zipCode").contains(
      listing["leasingAgentAddress.zipCode"]
    )
    cy.getByTestId("applicationMailingAddress.state").contains("CA")
    cy.getByID("applicationDropOffQuestion").contains("No")
    cy.getByID("postmarksConsideredQuestion").contains("Yes")
    cy.getByTestId("postmark-date").contains("12")
    cy.getByTestId("postmark-date").contains("17")
    cy.getByTestId("postmark-date").contains("2022")
    cy.getByTestId("postmark-time").contains("5")
    cy.getByTestId("postmark-time").contains("45")
    cy.getByTestId("postmark-time").contains("PM")
    cy.getByID("additionalApplicationSubmissionNotes").contains(
      listing["additionalApplicationSubmissionNotes"]
    )
    cy.getByID("openhouseHeader").contains("10/04/2022")
    cy.getByID("openhouseHeader").contains("10:04 AM")
    cy.getByID("openhouseHeader").contains("11:05 PM")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function verifyAutofill(cy: Cypress.cy, listing: any): void {
    cy.findAndOpenListing(listing["name"])
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByID("jurisdictions.id")
      .find("option:selected")
      .should("have.text", listing["jurisdiction.id"])

    cy.getByID("name").should("have.value", listing["name"])
    cy.getByID("developer").should("have.value", listing["developer"])
    cy.getByID("listingsBuildingAddress.street").should(
      "have.value",
      listing["buildingAddress.street"]
    )
    cy.getByID("neighborhood").should("have.value", listing["neighborhood"])
    cy.getByID("listingsBuildingAddress.city").should("have.value", listing["buildingAddress.city"])
    cy.getByID("listingsBuildingAddress.state")
      .find("option:selected")
      .should("have.text", listing["buildingAddress.state"])
    cy.getByID("listingsBuildingAddress.zipCode").should(
      "have.value",
      listing["buildingAddress.zipCode"]
    )
    cy.getByID("yearBuilt").should("have.value", listing["yearBuilt"])
    cy.getByID("reservedCommunityTypes.id")
      .find("option:selected")
      .should("have.text", listing["reservedCommunityType.id"])

    cy.getByID("reservedCommunityDescription").should(
      "have.value",
      listing["reservedCommunityDescription"]
    )
    cy.getByID("includeCommunityDisclaimerYes").should("be.checked")
    cy.getByID("communityDisclaimerTitle").should("have.value", listing["communityDisclaimerTitle"])
    cy.getByID("communityDisclaimerDescription").should(
      "have.value",
      listing["communityDisclaimerDescription"]
    )
    cy.getByTestId("unit-types").should("be.checked")
    cy.getByTestId("listingAvailability.availableUnits").should("be.checked")
    if (listing["homeType"]) {
      cy.getByID("homeType").find("option:selected").should("have.text", listing["homeType"])
    }
    // TODO Test unit drawer
    // TODO Test preferences
    cy.getByID("applicationFee").should("have.value", listing["applicationFee"])
    cy.getByID("depositMin").should("have.value", listing["depositMin"])
    cy.getByID("depositMax").should("have.value", listing["depositMax"])
    cy.getByID("costsNotIncluded").should("have.value", listing["costsNotIncluded"])
    if (listing["utilities"]) {
      listing["utilities"].forEach((utility: string) => {
        cy.getByID(utility.toLowerCase()).should("be.checked")
      })
    }
    cy.getByID("amenities").should("have.value", listing["amenities"])
    cy.getByID("accessibility").should("have.value", listing["accessibility"])
    cy.getByID("unitAmenities").should("have.value", listing["unitAmenities"])
    cy.getByID("smokingPolicy").should("have.value", listing["smokingPolicy"])
    cy.getByID("petPolicy").should("have.value", listing["petPolicy"])
    cy.getByID("servicesOffered").should("have.value", listing["servicesOffered"])
    if (listing["accessibilityFeatures"]) {
      listing["accessibilityFeatures"].forEach((feature: string[]) => {
        cy.getByID(feature[0]).should("be.checked")
      })
    }
    cy.getByID("creditHistory").should("have.value", listing["creditHistory"])
    cy.getByID("rentalHistory").should("have.value", listing["rentalHistory"])
    cy.getByID("criminalBackground").should("have.value", listing["criminalBackground"])
    cy.getByID("buildingSelectionCriteriaTable").contains(listing["buildingSelectionCriteriaURL"])
    cy.getByID("requiredDocuments").should("have.value", listing["requiredDocuments"])
    cy.getByID("programRules").should("have.value", listing["programRules"])
    cy.getByID("specialNotes").should("have.value", listing["specialNotes"])
    cy.get("button").contains("Application Process").click()
    cy.getByID("reviewOrderFCFS").should("be.checked")
    cy.getByID("waitlistOpenNo").should("be.checked")
    cy.getByID("leasingAgentName").should("have.value", listing["leasingAgentName"])
    cy.getByID("leasingAgentEmail").should("have.value", listing["leasingAgentEmail"])
    cy.getByID("leasingAgentPhone").should("have.value", "(520) 245-8811")
    cy.getByID("leasingAgentTitle").should("have.value", listing["leasingAgentTitle"])
    cy.getByID("leasingAgentOfficeHours").should("have.value", listing["leasingAgentOfficeHours"])
    cy.getByID("digitalApplicationChoiceYes").should("be.checked")
    cy.getByID("commonDigitalApplicationChoiceNo").should("be.checked")
    cy.getByID("customOnlineApplicationUrl").should("have.value", listing["url"])
    cy.getByID("paperApplicationNo").should("be.checked")
    // Referral opportunity not in Doorway
    // cy.getByID("referralOpportunityYes").should("be.checked")
    // cy.getByID("referralContactPhone").should("have.value", "(520) 245-8811")
    cy.getByID("listingsLeasingAgentAddress.street").should(
      "have.value",
      listing["leasingAgentAddress.street"]
    )
    cy.getByID("listingsLeasingAgentAddress.street2").should(
      "have.value",
      listing["leasingAgentAddress.street2"]
    )
    cy.getByID("listingsLeasingAgentAddress.city").should(
      "have.value",
      listing["leasingAgentAddress.city"]
    )
    cy.getByID("listingsLeasingAgentAddress.zipCode").should(
      "have.value",
      listing["leasingAgentAddress.zipCode"]
    )
    cy.getByID("listingsLeasingAgentAddress.state")
      .find("option:selected")
      .should("have.text", listing["leasingAgentAddress.state"])
    cy.getByID("applicationsMailedInYes").should("be.checked")
    cy.getByID("mailInAnotherAddress").should("be.checked")
    cy.getByTestId("mailing-address-street").should(
      "have.value",
      listing["leasingAgentAddress.street"]
    )
    cy.getByTestId("mailing-address-street2").should(
      "have.value",
      listing["leasingAgentAddress.street2"]
    )
    cy.getByTestId("mailing-address-city").should("have.value", listing["leasingAgentAddress.city"])
    cy.getByTestId("mailing-address-zip").should(
      "have.value",
      listing["leasingAgentAddress.zipCode"]
    )
    cy.getByTestId("mailing-address-state")
      .find("option:selected")
      .should("have.text", listing["leasingAgentAddress.state"])
    cy.getByID("applicationsPickedUpNo").should("be.checked")
    cy.getByID("applicationsDroppedOffNo").should("be.checked")
    cy.getByID("postmarksConsideredYes").should("be.checked")
    cy.getByTestId("postmark-date-field-month").should("have.value", "12")
    cy.getByTestId("postmark-date-field-day").should("have.value", "17")
    cy.getByTestId("postmark-date-field-year").should("have.value", "2022")
    cy.getByTestId("postmark-time-field-hours").should("have.value", "05")
    cy.getByTestId("postmark-time-field-minutes").should("have.value", "45")
    cy.getByTestId("postmark-time-field-period").should("have.value", "pm")
    cy.getByID("additionalApplicationSubmissionNotes").should(
      "have.value",
      listing["additionalApplicationSubmissionNotes"]
    )
    // TODO Test Open house events
    cy.getByID("applicationDueDateField.month").should("have.value", listing["date.month"])
    cy.getByID("applicationDueDateField.day").should("have.value", listing["date.day"])
    cy.getByID("applicationDueDateField.year").should(
      "have.value",
      (new Date().getFullYear() + 1).toString()
    )
    cy.getByID("applicationDueTimeField.hours").should("have.value", listing["startTime.hours"])
    cy.getByID("applicationDueTimeField.minutes").should("have.value", listing["startTime.minutes"])
    cy.getByID("applicationDueTimeField.period").should("have.value", "pm")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function verifyOpenListingWarning(cy: Cypress.cy, listing: any): void {
    cy.findAndOpenListing(listing["name"])
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByTestId("nameField")
      .should("be.visible")
      .click()
      .clear()
      .clear()
      .type(listing["editedName"])
    cy.getByID("saveAndContinueButton").contains("Save").click()
    cy.getByID("saveAlreadyLiveListingButtonConfirm").contains("Save").click()
    cy.getByTestId("page-header").should("have.text", listing["editedName"])
  }
  it("as admin user, should be able to download listings export zip", () => {
    const convertToString = (value: number) => {
      return value < 10 ? `0${value}` : `${value}`
    }
    cy.visit("/")
    cy.getByID("export-listings").click()
    const now = new Date()
    const dateString = `${now.getFullYear()}-${convertToString(
      now.getMonth() + 1
    )}-${convertToString(now.getDate())}`
    const timeString = `${convertToString(now.getHours())}-${convertToString(now.getMinutes())}`
    const zipName = `${dateString}_${timeString}-complete-listing-data.zip`
    const downloadFolder = Cypress.config("downloadsFolder")
    const completeZipPath = `${downloadFolder}/${zipName}`
    cy.readFile(completeZipPath)
  })
})

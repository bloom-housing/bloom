import { ApplicationMethodsTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { bloomingtonListing, CypressListing } from "../../fixtures/bloomingtonListing"

describe("Listing Management Tests", () => {
  beforeEach(() => {
    cy.loginApi()
  })

  after(() => {
    cy.signOutApi()
  })

  // it("error messaging & save dialogs", () => {
  //   // Test to check that the appropriate error messages happen on submit
  //   cy.visit("/")
  //   cy.get("button").contains("Add listing").click()
  //   cy.getByID("jurisdiction").select("Bloomington")
  //   cy.get("button").contains("Get started").click()
  //   cy.contains("New listing")
  //   // Save an empty listing as a draft and should show errors for appropriate fields
  //   cy.getByID("saveDraftButton").contains("Save as draft").click()
  //   cy.contains("Please resolve any errors before saving or publishing your listing.")
  //   cy.getByID("name-error").contains("This field is required")
  //   // Fill out minimum fields and errors get removed
  //   cy.getByID("name").type("Test - error messaging")
  //   cy.getByID("name-error").should("to.be.empty")
  //   cy.getByID("saveDraftButton").contains("Save as draft").click()
  //   cy.contains("Test - error messaging")
  //   cy.contains("Listing data")
  //   // Try to publish a listing and should show errors for appropriate fields
  //   cy.getByID("listingEditButton").contains("Edit").click()
  //   cy.getByID("reservedCommunityTypes.id").select(1)
  //   cy.getByID("includeCommunityDisclaimerYes").check()
  //   cy.getByID("publishButton").contains("Publish").click()
  //   cy.getByID("publishButtonConfirm").contains("Publish").click()
  //   cy.contains("Please resolve any errors before saving or publishing your listing.")
  //   cy.getByID("developer-error").contains("This field is required")
  //   cy.getByID("photos-error").contains("At least 1 image is required")
  //   cy.getByID("listingsBuildingAddress.street-error").contains("Cannot enter a partial address")
  //   cy.getByID("listingsBuildingAddress.city-error").contains("Cannot enter a partial address")
  //   cy.getByID("listingsBuildingAddress.state-error").contains("Cannot enter a partial address")
  //   cy.getByID("listingsBuildingAddress.zipCode-error").contains("Cannot enter a partial address")
  //   cy.get(`[data-variant="alert"`).should(($alertButtons) => {
  //     expect($alertButtons).to.have.length(2)
  //     expect($alertButtons[0]).to.have.id("add-photos-button")
  //     expect($alertButtons[1]).to.have.id("addUnitsButton")
  //   })
  //   cy.getByID("units-error").contains("This field is required")
  //   cy.getByID("communityDisclaimerTitle-error").contains("This field is required")
  //   cy.get(".textarea-error-message").contains("This field is required")
  //   cy.getByID("applicationProcessButton").contains("Application process").click()
  //   cy.getByID("leasingAgentName-error").contains("This field is required")
  //   cy.getByID("leasingAgentEmail-error").contains("This field is required")
  //   cy.getByID("leasingAgentPhone-error").contains("This field is required")
  //   cy.getByID("digitalApplicationChoice-error").contains("This field is required")
  //   cy.getByID("paperApplicationChoice-error").contains("This field is required")
  //   cy.getByID("referralOpportunityChoice-error").contains("This field is required")
  //   // Verify the behavior of Exit discard & confirm
  //   cy.contains("Listing details").click()
  //   cy.getByID("name").clear()
  //   cy.getByID("name").type("Test - error messaging DISCARD")
  //   cy.getByID("listingsExitButton").click()
  //   cy.getByID("listing-save-before-exit-dialog-content").contains(
  //     "Do you want to save your changes before you exit?"
  //   )
  //   cy.getByID("saveBeforeExitDiscard").click()
  //   cy.contains("Test - error messaging")
  //   cy.getByID("listingEditButton").contains("Edit").click()
  //   cy.getByID("name").clear()
  //   cy.getByID("name").type("Test - error messaging DISCARD")
  //   cy.getByID("listingsExitButton").click()
  //   cy.getByID("saveBeforeExitConfirm").click()
  //   cy.contains("Test - error messaging DISCARD")
  //   // Test save button
  //   cy.getByID("listingEditButton").contains("Edit").click()
  //   cy.getByID("saveAndContinueButton").contains("Save").click()
  //   cy.getByID("name").should("have.value", "Test - error messaging DISCARD")
  // })

  // it("error messaging publish with minimal fields", () => {
  //   cy.visit("/")
  //   cy.get("button").contains("Add listing").click()
  //   cy.getByID("jurisdiction").select("Lakeview")
  //   cy.get("button").contains("Get started").click()
  //   cy.contains("New listing")
  //   // Try to publish a listing and should show errors for appropriate fields
  //   cy.getByID("publishButton").contains("Publish").click()
  //   cy.getByID("publishButtonConfirm").contains("Publish").click()
  //   cy.contains("Please resolve any errors before saving or publishing your listing.")
  //   cy.getByID("name-error").contains("This field is required")
  //   cy.getByID("developer-error").contains("This field is required").should("not.exist")
  //   cy.getByID("listingsBuildingAddress.street-error").contains("Cannot enter a partial address")
  //   cy.getByID("listingsBuildingAddress.city-error").contains("Cannot enter a partial address")
  //   cy.getByID("listingsBuildingAddress.state-error").contains("Cannot enter a partial address")
  //   cy.getByID("listingsBuildingAddress.zipCode-error").contains("Cannot enter a partial address")
  //   cy.getByID("units-error").should("not.exist")
  //   cy.getByID("applicationProcessButton").contains("Application process").click()
  //   cy.getByID("leasingAgentName-error").contains("This field is required").should("not.exist")
  //   cy.getByID("leasingAgentEmail-error").contains("This field is required").should("not.exist")
  //   cy.getByID("leasingAgentPhone-error").should("not.exist")
  //   cy.getByID("digitalApplicationChoice-error").should(
  //     "not.include.text",
  //     "This field is required"
  //   )
  //   cy.getByID("paperApplicationChoice-error").should("not.include.text", "This field is required")
  //   cy.getByID("referralOpportunityChoice-error").should(
  //     "not.include.text",
  //     "This field is required"
  //   )
  // })

  it.only("full listing publish in Bloomington", () => {
    cy.visit("/")

    cy.get("button").contains("Add listing").click()
    cy.getByID("jurisdiction").select(bloomingtonListing.jurisdictions.id)
    cy.get("button").contains("Get started").click()
    cy.contains("New listing")
    fillOutListing(cy, bloomingtonListing)
    verifyDetails(cy, bloomingtonListing)
    verifyAutofill(cy, bloomingtonListing)
    verifyOpenListingWarning(cy, bloomingtonListing)
  })

  const fillIfDataExists = (
    cy: Cypress.cy,
    id: string,
    listingValue: string | undefined,
    entryType: "type" | "select" | "check"
  ) => {
    if (listingValue !== undefined && listingValue !== "") {
      switch (entryType) {
        case "type":
          cy.getByID(id).type(listingValue)
          break
        case "select":
          cy.getByID(id).select(listingValue)
          break
        case "check":
          cy.getByID(id).check()
          break
      }
    }
  }

  const fillRadio = (
    cy: Cypress.cy,
    idTrue: string,
    idFalse: string,
    listingValue: boolean | undefined
  ) => {
    if (listingValue !== undefined) {
      cy.getByID(listingValue ? idTrue : idFalse).check()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fillOutListing(cy: Cypress.cy, listing: CypressListing): void {
    cy.intercept("GET", "/geocoding/v5/**", { fixture: "address" })
    cy.intercept("POST", "https://api.cloudinary.com/v1_1/exygy/upload", {
      fixture: "cypressUpload",
    })

    fillIfDataExists(cy, "name", listing.name, "type")
    fillIfDataExists(cy, "developer", listing.developer, "type")

    // Test photo upload
    if (listing.cypressImages?.length) {
      listing.cypressImages.forEach((cypressImage, index) => {
        cy.intercept(
          "GET",
          `https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/${cypressImage.fixtureName}`,
          {
            fixture: cypressImage.fixtureName,
          }
        )
        cy.intercept("POST", "https://api.cloudinary.com/v1_1/exygy/upload", {
          public_id: `dev/${cypressImage.fixtureName.replace(".jpg", "")}`,
        })
        cy.getByID("add-photos-button")
          .contains(index > 0 ? "Edit photos" : "Add photo")
          .click()
        cy.getByTestId("dropzone-input").attachFile(cypressImage.fixtureName, {
          subjectType: "drag-n-drop",
        })

        if (cypressImage.altText) {
          cy.getByID("image-description").type(cypressImage.altText)
          cy.getByID("save-alt-text-button").contains("Save").click()
        }
        cy.getByID(`listing-drawer-image-${index}`)
          .should("have.attr", "src")
          .should("include", cypressImage.fixtureName.replace(".jpg", ""))
        cy.getByID("listing-photo-uploaded").contains("Save").click()
        cy.getByID(`listing-detail-image-${index}`)
          .should("have.attr", "src")
          .should("include", cypressImage.fixtureName.replace(".jpg", ""))
      })

      cy.getByTestId("photos-table")
        .get("tbody > tr")
        .should("have.length", listing.cypressImages?.length)
    }

    fillIfDataExists(
      cy,
      "listingsBuildingAddress.street",
      listing.listingsBuildingAddress.street,
      "type"
    )
    fillIfDataExists(cy, "neighborhood", listing.neighborhood, "type")
    fillIfDataExists(
      cy,
      "listingsBuildingAddress.city",
      listing.listingsBuildingAddress.city,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsBuildingAddress.state",
      listing.listingsBuildingAddress.state,
      "select"
    )
    fillIfDataExists(
      cy,
      "listingsBuildingAddress.zipCode",
      listing.listingsBuildingAddress.zipCode,
      "type"
    )
    fillIfDataExists(cy, "yearBuilt", listing.yearBuilt?.toString(), "type")

    cy.getByID("map-address-popup").contains(listing.listingsBuildingAddress.street)

    fillIfDataExists(cy, "reservedCommunityTypes.id", listing.reservedCommunityTypes?.id, "select")
    fillIfDataExists(
      cy,
      "reservedCommunityDescription",
      listing.reservedCommunityDescription,
      "type"
    )

    fillRadio(
      cy,
      "includeCommunityDisclaimerYes",
      "includeCommunityDisclaimerNo",
      listing.includeCommunityDisclaimer
    )

    fillIfDataExists(cy, "communityDisclaimerTitle", listing.communityDisclaimerTitle, "type")
    fillIfDataExists(
      cy,
      "communityDisclaimerDescription",
      listing.communityDisclaimerDescription,
      "type"
    )

    fillRadio(cy, "unitTypes", "individual-units", listing.disableUnitsAccordion)

    // TODO
    if (
      listing.reviewOrderType === "firstComeFirstServe" ||
      listing.reviewOrderType === "lottery"
    ) {
      cy.getByID("availableUnits").check()
    } else {
      cy.getByID("openWaitlist").check()
    }

    fillIfDataExists(cy, "homeType", listing.homeType, "select")

    listing.units.forEach((unit) => {
      cy.getByID("addUnitsButton").contains("Add unit").click()
      fillIfDataExists(cy, "number", unit.number, "type")
      fillIfDataExists(cy, "unitTypes.id", unit?.unitTypes?.id, "select")
      fillIfDataExists(cy, "numBathrooms", unit.numBathrooms?.toString(), "select")
      fillIfDataExists(cy, "floor", unit.floor?.toString(), "select")
      fillIfDataExists(cy, "sqFeet", unit.sqFeet, "type")
      fillIfDataExists(cy, "minOccupancy", unit.minOccupancy?.toString(), "select")
      fillIfDataExists(cy, "maxOccupancy", unit.maxOccupancy?.toString(), "select")

      fillIfDataExists(
        cy,
        "unitAccessibilityPriorityTypes.id",
        unit?.unitAccessibilityPriorityTypes?.id,
        "select"
      )

      if (unit.monthlyRentAsPercentOfIncome) {
        cy.getByID("percentage").check({ force: true })
        fillIfDataExists(
          cy,
          "monthlyRentAsPercentOfIncome",
          unit.monthlyRentAsPercentOfIncome,
          "type"
        )
      } else {
        cy.getByID("fixed").check({ force: true })
        fillIfDataExists(cy, "monthlyIncomeMin", unit.monthlyIncomeMin, "type")
        fillIfDataExists(cy, "monthlyRent", unit.monthlyRent, "type")
      }
      // TODO - Vary AMI chart selections
      cy.getByID("amiChart.id").find("option").should("have.length", 3)
      cy.getByID("amiChart.id").select(1).trigger("change")
      cy.getByID("amiPercentage").select(1)
      cy.get("button").contains("Save & exit").click()
    })

    // TODO - Allow for dynamic preferences & programs
    cy.getByID("add-preferences-button").contains("Add preference").click()
    cy.getByID("select-preferences-button").contains("Select preferences").click()
    cy.contains("label", "Work in the city").click()
    cy.getByID("add-preferences-save-button").contains("Save").click()
    cy.getByID("select-and-order-save-button").contains("Save").click()

    cy.getByID("add-programs-button").contains("Add program").click()
    cy.getByID("select-programs-button").contains("Select programs").click()
    cy.contains("label", "Veteran").click()
    cy.getByID("add-programs-save-button").contains("Save").click()
    cy.getByID("select-and-order-save-button").contains("Save").click()

    fillIfDataExists(cy, "applicationFee", listing.applicationFee, "type")
    fillIfDataExists(cy, "depositMin", listing.depositMin, "type")
    fillIfDataExists(cy, "depositMax", listing.depositMax, "type")
    fillIfDataExists(cy, "costsNotIncluded", listing.costsNotIncluded, "type")

    if (listing.listingUtilities) {
      Object.keys(listing.listingUtilities).forEach((utility) => {
        if (listing.listingUtilities?.[utility as keyof typeof listing.listingUtilities] === true) {
          cy.getByID(utility.toLowerCase()).check()
        }
      })
    }

    if (listing.listingFeatures) {
      Object.keys(listing.listingFeatures).forEach((feature) => {
        if (listing.listingFeatures?.[feature as keyof typeof listing.listingFeatures] === true) {
          cy.getByID(feature.toLowerCase()).check()
        }
      })
    }

    if (listing.listingNeighborhoodAmenities) {
      Object.keys(listing.listingNeighborhoodAmenities).forEach((amenity) => {
        fillIfDataExists(
          cy,
          `listingNeighborhoodAmenities.${amenity}`,
          listing.listingNeighborhoodAmenities?.[
            amenity as keyof typeof listing.listingNeighborhoodAmenities
          ] as string,
          "type"
        )
      })
    }

    fillIfDataExists(cy, "amenities", listing.amenities, "type")
    fillIfDataExists(cy, "accessibility", listing.accessibility, "type")
    fillIfDataExists(cy, "unitAmenities", listing.unitAmenities, "type")
    fillIfDataExists(cy, "smokingPolicy", listing.smokingPolicy, "type")
    fillIfDataExists(cy, "petPolicy", listing.petPolicy, "type")
    fillIfDataExists(cy, "servicesOffered", listing.servicesOffered, "type")

    fillIfDataExists(cy, "creditHistory", listing.creditHistory, "type")
    fillIfDataExists(cy, "rentalHistory", listing.rentalHistory, "type")
    fillIfDataExists(cy, "criminalBackground", listing.criminalBackground, "type")

    // TODO: Building selection criteria PDF
    if (listing.buildingSelectionCriteria) {
      cy.getByID("addBuildingSelectionCriteriaButton")
        .contains("Add building selection criteria")
        .click()
      cy.getByID("criteriaAttachTypeURL").check()
      cy.getByID("buildingSelectionCriteriaURL").type(listing.buildingSelectionCriteria)
      cy.getByID("saveBuildingSelectionCriteriaButton").contains("Save").click()
    }

    fillIfDataExists(cy, "requiredDocuments", listing.requiredDocuments, "type")
    fillIfDataExists(cy, "programRules", listing.programRules, "type")
    fillIfDataExists(cy, "specialNotes", listing.specialNotes, "type")

    // Second tab
    cy.get("button").contains("Application process").click()

    if (listing.reviewOrderType === "firstComeFirstServe") {
      cy.getByID("reviewOrderFCFS").check()
      // TODO - Do I need this??
      cy.getByID("waitlistOpenNo").check()
    } else if (listing.reviewOrderType === "lottery") {
      // TODO - Test a lottery listing and fill out date details
      cy.getByID("reviewOrderLottery").check()
    }

    if (listing.whatToExpect) {
      fillIfDataExists(cy, "whatToExpect", listing.whatToExpect, "type")
    } else {
      // Testing rich text editor if data is null
      cy.getByID("whatToExpect").children().first().clear()
      cy.getByID("whatToExpect").type("Custom unformatted text")
      cy.getByID("whatToExpect").type("{enter}Item A")
      cy.getByID("whatToExpect")
        .parent()
        .within(() => {
          cy.getByID("editor-bullet-list").click()
        })
      cy.getByID("whatToExpect").click()
      cy.getByID("whatToExpect").type("{enter}Item B{enter}Item C")
    }

    fillIfDataExists(cy, "leasingAgentName", listing.leasingAgentName, "type")
    fillIfDataExists(cy, "leasingAgentEmail", listing.leasingAgentEmail, "type")
    fillIfDataExists(cy, "leasingAgentPhone", listing.leasingAgentPhone, "type")
    fillIfDataExists(cy, "leasingAgentTitle", listing.leasingAgentTitle, "type")
    fillIfDataExists(cy, "leasingAgentOfficeHours", listing.leasingAgentOfficeHours, "type")

    const internalMethod = listing.applicationMethods.find(
      (method) => method.type === ApplicationMethodsTypeEnum.Internal
    )

    const externalMethod = listing.applicationMethods.find(
      (method) => method.type === ApplicationMethodsTypeEnum.ExternalLink
    )

    const referralMethod = listing.applicationMethods.find(
      (method) => method.type === ApplicationMethodsTypeEnum.Referral
    )

    if (internalMethod || externalMethod) {
      cy.getByID("digitalApplicationChoiceYes").check()
    }

    if (externalMethod) {
      cy.getByID("commonDigitalApplicationChoiceNo").check()
      fillIfDataExists(cy, "customOnlineApplicationUrl", externalMethod.externalReference, "type")
    } else {
      cy.getByID("commonDigitalApplicationChoiceYes").check()
    }

    // TODO - Test paper application upload
    cy.getByID("paperApplicationNo").check()

    if (referralMethod) {
      cy.getByID("referralOpportunityYes").check()
      fillIfDataExists(cy, "referralContactPhone", referralMethod.phoneNumber, "type")
    }

    fillIfDataExists(
      cy,
      "listingsLeasingAgentAddress.street",
      listing.listingsLeasingAgentAddress?.street,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsLeasingAgentAddress.street2",
      listing.listingsLeasingAgentAddress?.street2,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsLeasingAgentAddress.city",
      listing.listingsLeasingAgentAddress?.city,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsLeasingAgentAddress.zipCode",
      listing.listingsLeasingAgentAddress?.zipCode,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsLeasingAgentAddress.state",
      listing.listingsLeasingAgentAddress?.state,
      "select"
    )

    cy.getByID("applicationsMailedInYes").check()
    cy.getByID("mailInAnotherAddress").check()
    fillIfDataExists(
      cy,
      "listingsApplicationMailingAddress.street",
      listing.listingsApplicationMailingAddress?.street,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsApplicationMailingAddress.street2",
      listing.listingsApplicationMailingAddress?.street2,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsApplicationMailingAddress.city",
      listing.listingsApplicationMailingAddress?.city,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsApplicationMailingAddress.zipCode",
      listing.listingsApplicationMailingAddress?.zipCode,
      "type"
    )
    fillIfDataExists(
      cy,
      "listingsApplicationMailingAddress.state",
      listing.listingsApplicationMailingAddress?.state,
      "select"
    )

    // TODO - Testing pick up and drop off addresses
    cy.getByID("applicationsPickedUpNo").check()
    cy.getByID("applicationsDroppedOffNo").check()
    if (listing.postmarkDate) {
      cy.getByID("postmarksConsideredYes").check()
      cy.getByTestId("postmark-date-field-month").type(listing.postmarkDate.month)
      cy.getByTestId("postmark-date-field-day").type(listing.postmarkDate.day)
      cy.getByTestId("postmark-date-field-year").type(listing.postmarkDate.year)
      cy.getByTestId("postmark-time-field-hours").type(listing.postmarkDate.startHours)
      cy.getByTestId("postmark-time-field-minutes").type(listing.postmarkDate.startMinutes)
      cy.getByTestId("postmark-time-field-period").select("PM")
    } else {
      cy.getByID("postmarksConsideredNo").check()
    }

    fillIfDataExists(
      cy,
      "additionalApplicationSubmissionNotes",
      listing.additionalApplicationSubmissionNotes,
      "type"
    )

    // TODO Type as listing events
    const openHouseEvents = listing.events.filter((e) => e.type === "openHouse")
    if (openHouseEvents.length > 0) {
      openHouseEvents.forEach((event) => {
        cy.getByID("addOpenHouseButton").contains("Add open house").click()
        cy.getByID("date.month").type(event.dateTime.month)
        cy.getByID("date.day").type(event.dateTime.day)
        cy.getByID("date.year").type(event.dateTime.year)
        cy.getByID("label").type(event.label)
        cy.getByID("url").type(event.url)
        cy.getByID("startTime.hours").type(event.dateTime.startHours)
        cy.getByID("startTime.minutes").type(event.dateTime.startMinutes)
        cy.getByID("endTime.hours").type(event.dateTime.endHours)
        cy.getByID("endTime.minutes").type(event.dateTime.endMinutes)
        cy.getByID("note").type(event.note)
        cy.getByID("startTime.period").select("AM")
        cy.getByID("endTime.period").select("PM")
        cy.getByID("saveOpenHouseFormButton").contains("Save").click()
      })
    }

    if (listing.dueDate) {
      cy.getByID("applicationDueDateField.month").type(listing.dueDate.month)
      cy.getByID("applicationDueDateField.day").type(listing.dueDate.day)
      cy.getByID("applicationDueDateField.year").type(listing.dueDate.year)
      cy.getByID("applicationDueTimeField.hours").type(listing.dueDate.startHours)
      cy.getByID("applicationDueTimeField.minutes").type(listing.dueDate.startMinutes)
      cy.getByID("applicationDueTimeField.period").select("PM")
    }

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
      .should("include", "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96")
    cy.getByID("buildingAddress.street").contains(listing["buildingAddress.street"])
    cy.getByID("neighborhood").contains(listing.neighborhood)
    cy.getByID("neighborhood").contains(listing.neighborhood)
    cy.getByID("buildingAddress.city").contains(listing["buildingAddress.city"])
    cy.getByID("buildingAddress.state").contains("CA")
    cy.getByID("buildingAddress.zipCode").contains(listing["buildingAddress.zipCode"])
    cy.getByID("yearBuilt").contains(listing["yearBuilt"])
    cy.getByID("longitude").should("include.text", "-122")
    cy.getByID("latitude").should("include.text", "37.7")
    cy.getByID("reservedCommunityType").contains(listing["reservedCommunityType.id"])
    cy.getByID("reservedCommunityDescription").contains(listing["reservedCommunityDescription"])
    cy.getByID("includeCommunityDisclaimer").contains("Yes")
    cy.getByID("communityDisclaimerTitle").contains(listing["communityDisclaimerTitle"])
    cy.getByID("communityDisclaimerDescription").contains(listing["communityDisclaimerDescription"])
    if (listing["homeType"]) {
      cy.getByID("homeType").contains(listing["homeType"])
    }
    cy.getByTestId("unit-types-or-individual").contains("Unit types")
    cy.getByTestId("listing-availability-question").contains("Available units")
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
    cy.getByID("neighborhoodAmenities.publicTransportation").contains(
      listing["listingNeighborhoodAmenities.publicTransportation"]
    )
    cy.getByID("neighborhoodAmenities.parksAndCommunityCenters").contains(
      listing["listingNeighborhoodAmenities.parksAndCommunityCenters"]
    )
    cy.getByID("neighborhoodAmenities.schools").contains(
      listing["listingNeighborhoodAmenities.schools"]
    )
    cy.getByID("neighborhoodAmenities.groceryStores").contains(
      listing["listingNeighborhoodAmenities.groceryStores"]
    )
    cy.getByID("neighborhoodAmenities.pharmacies").contains(
      listing["listingNeighborhoodAmenities.pharmacies"]
    )
    cy.getByID("neighborhoodAmenities.healthCareResources").contains(
      listing["listingNeighborhoodAmenities.healthCareResources"]
    )
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
    cy.getByID("referralOpportunity").contains("Yes")
    cy.getByID("referralContactPhone").contains("(520) 245-8811")
    cy.getByID("referralSummary").contains(listing["referralSummary"])
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
    cy.getByID("listingNeighborhoodAmenities.publicTransportation").should(
      "have.value",
      listing["listingNeighborhoodAmenities.publicTransportation"]
    )
    cy.getByID("listingNeighborhoodAmenities.parksAndCommunityCenters").should(
      "have.value",
      listing["listingNeighborhoodAmenities.parksAndCommunityCenters"]
    )
    cy.getByID("listingNeighborhoodAmenities.schools").should(
      "have.value",
      listing["listingNeighborhoodAmenities.schools"]
    )
    cy.getByID("listingNeighborhoodAmenities.groceryStores").should(
      "have.value",
      listing["listingNeighborhoodAmenities.groceryStores"]
    )
    cy.getByID("listingNeighborhoodAmenities.pharmacies").should(
      "have.value",
      listing["listingNeighborhoodAmenities.pharmacies"]
    )
    cy.getByID("listingNeighborhoodAmenities.healthCareResources").should(
      "have.value",
      listing["listingNeighborhoodAmenities.healthCareResources"]
    )
    if (listing["accessibilityFeatures"]) {
      listing["accessibilityFeatures"].forEach((feature: string[]) => {
        cy.getByID(`configurableAccessibilityFeatures.${feature[0]}`).should("be.checked")
      })
    }
    cy.getByID("creditHistory").should("have.value", listing["creditHistory"])
    cy.getByID("rentalHistory").should("have.value", listing["rentalHistory"])
    cy.getByID("criminalBackground").should("have.value", listing["criminalBackground"])
    cy.getByID("buildingSelectionCriteriaTable").contains(listing["buildingSelectionCriteriaURL"])
    cy.getByID("requiredDocuments").should("have.value", listing["requiredDocuments"])
    cy.getByID("programRules").should("have.value", listing["programRules"])
    cy.getByID("specialNotes").should("have.value", listing["specialNotes"])
    cy.get("button").contains("Application process").click()
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
    cy.getByID("referralOpportunityYes").should("be.checked")
    cy.getByID("referralContactPhone").should("have.value", "(520) 245-8811")
    cy.getByID("referralSummary").should("have.value", listing["referralSummary"])
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
  // it("as admin user, should be able to download listings export zip", () => {
  //   const convertToString = (value: number) => {
  //     return value < 10 ? `0${value}` : `${value}`
  //   }
  //   cy.visit("/")
  //   cy.getByID("export-listings").click()
  //   const now = new Date()
  //   const dateString = `${now.getFullYear()}-${convertToString(
  //     now.getMonth() + 1
  //   )}-${convertToString(now.getDate())}`
  //   const timeString = `${convertToString(now.getHours())}-${convertToString(now.getMinutes())}`
  //   const zipName = `${dateString}_${timeString}-complete-listing-data.zip`
  //   const downloadFolder = Cypress.config("downloadsFolder")
  //   const completeZipPath = `${downloadFolder}/${zipName}`
  //   cy.readFile(completeZipPath)
  // })
})

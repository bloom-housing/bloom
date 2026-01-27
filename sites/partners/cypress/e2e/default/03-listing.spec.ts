import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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

  const verifyDataIfExists = (
    cy: Cypress.cy,
    id: string,
    listingValue: string | undefined,
    entryType: "type" | "select" | "check"
  ) => {
    if (listingValue !== undefined && listingValue !== "") {
      switch (entryType) {
        case "type":
          cy.getByID(id).should("have.value", listingValue)
          break
        case "select":
          cy.getByID(id).find("option:selected").should("have.text", listingValue)
          break
        case "check":
          cy.getByID(id).should("be.checked")
          break
      }
    }
  }

  const verifyDetailDataIfExists = (
    cy: Cypress.cy,
    id: string,
    listingValue: string | undefined
  ) => {
    if (listingValue !== undefined && listingValue !== "") {
      cy.getByID(id).contains(listingValue)
    }
  }

  const verifyRadioIfExists = (
    cy: Cypress.cy,
    idTrue: string,
    idFalse: string,
    listingValue: boolean | undefined
  ) => {
    if (listingValue !== undefined) {
      cy.getByID(listingValue ? idTrue : idFalse).should("be.checked")
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
      cy.getByTestId("postmark-time-field-period").select(listing.postmarkDate.period.toUpperCase())
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
        cy.getByID("startTime.period").select(event.dateTime.period)
        cy.getByID("endTime.period").select(event.dateTime.period)
        cy.getByID("saveOpenHouseFormButton").contains("Save").click()
      })
    }

    if (listing.dueDate) {
      cy.getByID("applicationDueDateField.month").type(listing.dueDate.month)
      cy.getByID("applicationDueDateField.day").type(listing.dueDate.day)
      cy.getByID("applicationDueDateField.year").type(listing.dueDate.year)
      cy.getByID("applicationDueTimeField.hours").type(listing.dueDate.startHours)
      cy.getByID("applicationDueTimeField.minutes").type(listing.dueDate.startMinutes)
      cy.getByID("applicationDueTimeField.period").select(listing.dueDate.period)
    }

    cy.getByID("publishButton").contains("Publish").click()

    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.get("[data-testid=page-header]").should("be.visible")
    cy.getByTestId("page-header").should("have.text", listing.name)
  }

  const capitalizeFirstLetter = (value: string | undefined) => {
    if (!value) return "" // Handle empty or null strings
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const formatPhoneNumber = (phone: string | undefined): string => {
    if (!phone) return ""
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "")
    // Match the digits: 3 for area code, 3 for exchange, 4 for subscriber
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }

    // Return original if not 10 digits
    return phone
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function verifyDetails(cy: Cypress.cy, listing: CypressListing): void {
    cy.findAndOpenListing(listing.name)
    cy.getByID("jurisdictions.name").contains(listing["jurisdiction.id"])
    verifyDetailDataIfExists(cy, "name", listing.name)
    verifyDetailDataIfExists(cy, "developer", listing.developer)

    cy.get('[data-label="Preview"]')
      .find("img")
      .should("have.attr", "src")
      .should("include", "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96")

    if (listing.cypressImages?.length) {
      listing.cypressImages.forEach((cypressImage, index) => {
        cy.getByID(`listing-detail-image-${index}`)
          .should("have.attr", "src")
          .should("include", cypressImage.fixtureName.replace(".jpg", ""))
      })
    }
    verifyDetailDataIfExists(cy, "buildingAddress.street", listing.listingsBuildingAddress.street)
    verifyDetailDataIfExists(cy, "neighborhood", listing.neighborhood)
    verifyDetailDataIfExists(cy, "buildingAddress.city", listing.listingsBuildingAddress.city)
    verifyDetailDataIfExists(
      cy,
      "buildingAddress.state",
      listing.listingsBuildingAddress.abbreviatedState
    )
    verifyDetailDataIfExists(cy, "buildingAddress.zipCode", listing.listingsBuildingAddress.zipCode)
    verifyDetailDataIfExists(cy, "yearBuilt", listing.yearBuilt?.toString())

    // Hm idk how to do this
    // cy.getByID("longitude").should("include.text", "-122")
    // cy.getByID("latitude").should("include.text", "37.7")

    verifyDetailDataIfExists(cy, "reservedCommunityType", listing.reservedCommunityTypes?.id)
    verifyDetailDataIfExists(
      cy,
      "reservedCommunityDescription",
      listing.reservedCommunityDescription
    )
    verifyDetailDataIfExists(
      cy,
      "includeCommunityDisclaimer",
      listing.includeCommunityDisclaimer ? "Yes" : "No"
    )

    verifyDetailDataIfExists(cy, "communityDisclaimerTitle", listing.communityDisclaimerTitle)
    verifyDetailDataIfExists(
      cy,
      "communityDisclaimerDescription",
      listing.communityDisclaimerDescription
    )

    verifyDetailDataIfExists(cy, "homeType", capitalizeFirstLetter(listing.homeType))

    verifyDetailDataIfExists(
      cy,
      "unitTypesOrIndividual",
      listing.disableUnitsAccordion ? "Unit types" : "Individual units"
    )

    verifyDetailDataIfExists(
      cy,
      "listings.listingAvailabilityQuestion",
      listing.reviewOrderType === "firstComeFirstServe" || listing.reviewOrderType === "lottery"
        ? "Available units"
        : "Open waitlist"
    )

    listing.units?.forEach((unit) => {
      verifyDetailDataIfExists(cy, "unitTable", unit.number)
      verifyDetailDataIfExists(cy, "unitTable", unit.sqFeet)
      verifyDetailDataIfExists(cy, "unitTable", unit.monthlyRent)
      verifyDetailDataIfExists(cy, "unitTable", unit.unitAccessibilityPriorityTypes?.id)
    })

    // TODO - Allow for dynamic preferences & programs
    cy.getByID("preferenceTable").contains("1")
    cy.getByID("preferenceTable").contains("Work in the city")
    cy.getByID("preferenceTable").contains("At least one member of my household works in the city")

    verifyDetailDataIfExists(cy, "programTable", "1")
    verifyDetailDataIfExists(cy, "programTable", "Veteran")
    verifyDetailDataIfExists(
      cy,
      "programTable",
      "Have you or anyone in your household served in the US military?"
    )

    verifyDetailDataIfExists(cy, "applicationFee", listing.applicationFee)
    verifyDetailDataIfExists(cy, "depositMin", listing.depositMin)
    verifyDetailDataIfExists(cy, "depositMax", listing.depositMax)
    verifyDetailDataIfExists(cy, "costsNotIncluded", listing.costsNotIncluded)

    if (listing.cypressUtilities) {
      listing.cypressUtilities.forEach((utility) => {
        cy.getByID("utilities").contains(utility.translation)
      })
    }

    if (listing.listingNeighborhoodAmenities) {
      Object.keys(listing.listingNeighborhoodAmenities).forEach((amenity) => {
        verifyDetailDataIfExists(
          cy,
          `neighborhoodAmenities.${amenity}`,
          listing.listingNeighborhoodAmenities?.[
            amenity as keyof typeof listing.listingNeighborhoodAmenities
          ] as string
        )
      })
    }

    if (listing.cypressFeatures) {
      listing.cypressFeatures.forEach((feature) => {
        cy.getByID("accessibilityFeatures").contains(feature.translation)
      })
    }

    verifyDetailDataIfExists(cy, "amenities", listing.amenities)
    verifyDetailDataIfExists(cy, "unitAmenities", listing.unitAmenities)
    verifyDetailDataIfExists(cy, "accessibility", listing.accessibility)
    verifyDetailDataIfExists(cy, "smokingPolicy", listing.smokingPolicy)
    verifyDetailDataIfExists(cy, "petPolicy", listing.petPolicy)
    verifyDetailDataIfExists(cy, "servicesOffered", listing.servicesOffered)

    verifyDetailDataIfExists(cy, "creditHistory", listing["creditHistory"])
    verifyDetailDataIfExists(cy, "rentalHistory", listing["rentalHistory"])
    verifyDetailDataIfExists(cy, "criminalBackground", listing["criminalBackground"])
    // TODO - Allow for dynamic rental assistance text
    verifyDetailDataIfExists(
      cy,
      "rentalAssistance",
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy."
    )

    verifyDetailDataIfExists(
      cy,
      "buildingSelectionCriteriaTable",
      listing["buildingSelectionCriteria"]
    )
    verifyDetailDataIfExists(cy, "requiredDocuments", listing["requiredDocuments"])
    verifyDetailDataIfExists(cy, "programRules", listing["programRules"])
    verifyDetailDataIfExists(cy, "specialNotes", listing["specialNotes"])

    verifyDetailDataIfExists(
      cy,
      "reviewOrderQuestion",
      listing.reviewOrderType === "firstComeFirstServe"
        ? "First come first serve"
        : listing.reviewOrderType === "lottery"
        ? "Lottery"
        : "Waitlist"
    )
    if (listing.whatToExpect) {
      verifyDetailDataIfExists(cy, "whatToExpect", listing.whatToExpect)
    } else {
      cy.getByID("whatToExpect").contains("Custom unformatted text")
      cy.getByID("whatToExpect").contains("li", "Item A")
      cy.getByID("whatToExpect").contains("li", "Item B")
      cy.getByID("whatToExpect").contains("li", "Item C")
    }

    verifyDetailDataIfExists(cy, "leasingAgentName", listing.leasingAgentName)
    verifyDetailDataIfExists(cy, "leasingAgentEmail", listing.leasingAgentEmail?.toLowerCase())
    verifyDetailDataIfExists(cy, "leasingAgentPhone", formatPhoneNumber(listing.leasingAgentPhone))
    verifyDetailDataIfExists(cy, "leasingAgentOfficeHours", listing.leasingAgentOfficeHours)
    verifyDetailDataIfExists(cy, "leasingAgentTitle", listing.leasingAgentTitle)

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
      cy.getByID("digitalApplication").contains("Yes")
    } else {
      cy.getByID("digitalApplication").contains("No")
    }

    if (externalMethod) {
      cy.getByID("digitalMethod.type").contains("No")

      if (externalMethod.externalReference) {
        cy.getByID("customOnlineApplicationUrl").contains(externalMethod.externalReference)
      }
    } else if (internalMethod) {
      cy.getByID("digitalMethod.type").contains("Yes")
    }

    // TODO - Test paper application upload
    cy.getByID("paperApplication").contains("No")

    if (referralMethod) {
      cy.getByID("referralOpportunity").contains("Yes")
      verifyDetailDataIfExists(
        cy,
        "referralContactPhone",
        formatPhoneNumber(referralMethod.phoneNumber)
      )
    } else {
      cy.getByID("referralOpportunity").contains("No")
    }

    verifyDetailDataIfExists(
      cy,
      "leasingAgentAddress.street",
      listing.listingsLeasingAgentAddress?.street
    )
    verifyDetailDataIfExists(
      cy,
      "leasingAgentAddress.street2",
      listing.listingsLeasingAgentAddress?.street2
    )
    verifyDetailDataIfExists(
      cy,
      "leasingAgentAddress.city",
      listing.listingsLeasingAgentAddress?.city
    )
    verifyDetailDataIfExists(
      cy,
      "leasingAgentAddress.state",
      listing.listingsLeasingAgentAddress?.abbreviatedState
    )
    verifyDetailDataIfExists(
      cy,
      "leasingAgentAddress.zipCode",
      listing.listingsLeasingAgentAddress?.zipCode
    )

    // TODO - Allow for dynamic pick up and drop off addresses
    cy.getByID("applicationPickupQuestion").contains("No")
    cy.getByID("applicationDropOffQuestion").contains("No")

    if (listing.listingsApplicationMailingAddress) {
      cy.getByID("applicationMailingSection").contains("Yes")
      verifyDetailDataIfExists(
        cy,
        "applicationMailingAddress.street",
        listing.listingsApplicationMailingAddress?.street
      )
      verifyDetailDataIfExists(
        cy,
        "applicationMailingAddress.street2",
        listing.listingsApplicationMailingAddress?.street2
      )
      verifyDetailDataIfExists(
        cy,
        "applicationMailingAddress.city",
        listing.listingsApplicationMailingAddress?.city
      )
      verifyDetailDataIfExists(
        cy,
        "applicationMailingAddress.zipCode",
        listing.listingsApplicationMailingAddress?.zipCode
      )
      verifyDetailDataIfExists(
        cy,
        "applicationMailingAddress.state",
        listing.listingsApplicationMailingAddress?.abbreviatedState
      )
    } else {
      cy.getByID("applicationMailingSection").contains("No")
    }
    cy.getByID("applicationMailingSection").contains("Yes")

    if (listing.postmarkDate) {
      cy.getByID("postmarksConsideredQuestion").contains("Yes")
      cy.getByTestId("postmark-date").contains(listing.postmarkDate.day)
      cy.getByTestId("postmark-date").contains(listing.postmarkDate.month)
      cy.getByTestId("postmark-date").contains(listing.postmarkDate.year)
      cy.getByTestId("postmark-time").contains(listing.postmarkDate.startHours)
      cy.getByTestId("postmark-time").contains(listing.postmarkDate.startMinutes)
      cy.getByTestId("postmark-time").contains(listing.postmarkDate.period.toUpperCase())
    } else {
      cy.getByID("postmarksConsideredQuestion").contains("No")
    }

    verifyDetailDataIfExists(
      cy,
      "additionalApplicationSubmissionNotes",
      listing.additionalApplicationSubmissionNotes
    )

    const openHouseEvents = listing.events.filter((e) => e.type === "openHouse")
    if (openHouseEvents.length > 0) {
      openHouseEvents.forEach((event) => {
        cy.getByID("openhouseHeader").contains(
          `${event.dateTime.month}/${event.dateTime.day}/${event.dateTime.year}`
        )
        cy.getByID("openhouseHeader").contains(
          `${event.dateTime.startHours}:${
            event.dateTime.startMinutes
          } ${event.dateTime.period.toUpperCase()}`
        )
        cy.getByID("openhouseHeader").contains(
          `${event.dateTime.endHours}:${
            event.dateTime.endMinutes
          } ${event.dateTime.period.toUpperCase()}`
        )
      })
    }

    if (listing.dueDate) {
      cy.getByID("applicationDeadline").contains(
        `${listing.dueDate.month}/${listing.dueDate.day}/${listing.dueDate.year}`
      )
      cy.getByID("applicationDueTime").contains(
        `${listing.dueDate.startHours}:${
          listing.dueDate.startMinutes
        } ${listing.dueDate.period.toUpperCase()}`
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function verifyAutofill(cy: Cypress.cy, listing: CypressListing): void {
    cy.findAndOpenListing(listing.name)
    cy.getByID("listingEditButton").contains("Edit").click()

    verifyDataIfExists(cy, "name", listing.name, "type")
    verifyDataIfExists(cy, "developer", listing.developer, "type")
    verifyDataIfExists(
      cy,
      "listingsBuildingAddress.street",
      listing.listingsBuildingAddress.street,
      "type"
    )
    verifyDataIfExists(cy, "neighborhood", listing.neighborhood, "type")
    verifyDataIfExists(
      cy,
      "listingsBuildingAddress.city",
      listing.listingsBuildingAddress.city,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsBuildingAddress.state",
      listing.listingsBuildingAddress.state,
      "select"
    )
    verifyDataIfExists(
      cy,
      "listingsBuildingAddress.zipCode",
      listing.listingsBuildingAddress.zipCode,
      "type"
    )
    verifyDataIfExists(cy, "yearBuilt", listing.yearBuilt?.toString(), "type")
    cy.getByID("yearBuilt").should("have.value", listing.yearBuilt)
    if (listing.reservedCommunityTypes) {
      verifyDataIfExists(
        cy,
        "reservedCommunityTypes.id",
        listing.reservedCommunityTypes.id,
        "select"
      )
    }

    verifyDataIfExists(
      cy,
      "reservedCommunityDescription",
      listing.reservedCommunityDescription,
      "type"
    )

    verifyRadioIfExists(
      cy,
      "includeCommunityDisclaimerYes",
      "includeCommunityDisclaimerNo",
      listing.includeCommunityDisclaimer
    )

    verifyDataIfExists(cy, "communityDisclaimerTitle", listing.communityDisclaimerTitle, "type")
    verifyDataIfExists(
      cy,
      "communityDisclaimerDescription",
      listing.communityDisclaimerDescription,
      "type"
    )

    verifyRadioIfExists(cy, "unitTypes", "individual-units", listing.disableUnitsAccordion)

    verifyRadioIfExists(
      cy,
      "availableUnits",
      "openWaitlist",
      listing.reviewOrderType === "firstComeFirstServe" || listing.reviewOrderType === "lottery"
    )

    verifyDataIfExists(cy, "homeType", capitalizeFirstLetter(listing.homeType), "select")

    // TODO Test unit drawer
    // TODO Test preferences
    // TODO Test programs
    verifyDataIfExists(cy, "applicationFee", listing.applicationFee, "type")
    verifyDataIfExists(cy, "depositMin", listing.depositMin, "type")
    verifyDataIfExists(cy, "depositMax", listing.depositMax, "type")
    verifyDataIfExists(cy, "costsNotIncluded", listing.costsNotIncluded, "type")
    if (listing.listingUtilities) {
      Object.keys(listing.listingUtilities).forEach((utility) => {
        verifyDataIfExists(
          cy,
          utility.toLowerCase(),
          listing.listingUtilities?.[utility as keyof typeof listing.listingUtilities]
            ? "true"
            : "",
          "check"
        )
      })
    }

    if (listing.listingNeighborhoodAmenities) {
      Object.keys(listing.listingNeighborhoodAmenities).forEach((amenity) => {
        verifyDataIfExists(
          cy,
          `listingNeighborhoodAmenities.${amenity}`,
          listing.listingNeighborhoodAmenities?.[
            amenity as keyof typeof listing.listingNeighborhoodAmenities
          ] as string,
          "type"
        )
      })
    }

    if (listing.listingFeatures) {
      Object.keys(listing.listingFeatures).forEach((feature) => {
        verifyDataIfExists(
          cy,
          feature.toLowerCase(),
          listing.listingFeatures?.[feature as keyof typeof listing.listingFeatures] ? "true" : "",
          "check"
        )
      })
    }
    verifyDataIfExists(cy, "amenities", listing.amenities, "type")
    verifyDataIfExists(cy, "accessibility", listing.accessibility, "type")
    verifyDataIfExists(cy, "unitAmenities", listing.unitAmenities, "type")
    verifyDataIfExists(cy, "smokingPolicy", listing.smokingPolicy, "type")
    verifyDataIfExists(cy, "petPolicy", listing.petPolicy, "type")
    verifyDataIfExists(cy, "servicesOffered", listing.servicesOffered, "type")
    verifyDataIfExists(cy, "creditHistory", listing.creditHistory, "type")
    verifyDataIfExists(cy, "rentalHistory", listing.rentalHistory, "type")
    verifyDataIfExists(cy, "criminalBackground", listing.criminalBackground, "type")
    verifyDataIfExists(cy, "rentalAssistance", listing.rentalAssistance, "type")

    verifyDetailDataIfExists(
      cy,
      "buildingSelectionCriteriaTable",
      listing["buildingSelectionCriteria"]
    )
    verifyDataIfExists(cy, "requiredDocuments", listing.requiredDocuments, "type")
    verifyDataIfExists(cy, "programRules", listing.programRules, "type")
    verifyDataIfExists(cy, "specialNotes", listing.specialNotes, "type")

    // Second tab
    cy.get("button").contains("Application process").click()

    verifyRadioIfExists(
      cy,
      "reviewOrderFCFS",
      "reviewOrderLottery",
      listing.reviewOrderType === "firstComeFirstServe"
    )

    if (listing.whatToExpect) {
      verifyDataIfExists(cy, "whatToExpect", listing.whatToExpect, "type")
    } else {
      // Testing rich text editor if data is null - idk if this will work
      cy.getByID("whatToExpect").should("have.text", "Custom unformatted textItem AItem BItem C")
    }
    verifyRadioIfExists(cy, "waitlistOpenNo", "waitlistOpenYes", listing.isWaitlistOpen)
    verifyDataIfExists(cy, "leasingAgentName", listing.leasingAgentName, "type")
    verifyDataIfExists(cy, "leasingAgentEmail", listing.leasingAgentEmail, "type")
    verifyDataIfExists(
      cy,
      "leasingAgentPhone",
      formatPhoneNumber(listing.leasingAgentPhone),
      "type"
    )
    verifyDataIfExists(cy, "leasingAgentTitle", listing.leasingAgentTitle, "type")
    verifyDataIfExists(cy, "leasingAgentOfficeHours", listing.leasingAgentOfficeHours, "type")

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
      cy.getByID("digitalApplicationChoiceYes").should("be.checked")
    }

    if (externalMethod) {
      cy.getByID("commonDigitalApplicationChoiceNo").should("be.checked")
      verifyDataIfExists(cy, "customOnlineApplicationUrl", externalMethod.externalReference, "type")
    } else {
      cy.getByID("commonDigitalApplicationChoiceYes").should("be.checked")
    }

    // TODO - Test paper application upload
    cy.getByID("paperApplicationNo").should("be.checked")

    if (referralMethod) {
      verifyRadioIfExists(cy, "referralOpportunityYes", "referralOpportunityNo", true)
      verifyDataIfExists(
        cy,
        "referralContactPhone",
        formatPhoneNumber(referralMethod.phoneNumber),
        "type"
      )
    }

    verifyDataIfExists(
      cy,
      "listingsLeasingAgentAddress.street",
      listing.listingsLeasingAgentAddress?.street,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsLeasingAgentAddress.street2",
      listing.listingsLeasingAgentAddress?.street2,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsLeasingAgentAddress.city",
      listing.listingsLeasingAgentAddress?.city,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsLeasingAgentAddress.zipCode",
      listing.listingsLeasingAgentAddress?.zipCode,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsLeasingAgentAddress.state",
      listing.listingsLeasingAgentAddress?.state,
      "select"
    )
    if (listing.listingsApplicationMailingAddress) {
      cy.getByID("applicationsMailedInYes").should("be.checked")
    }
    if (listing.applicationMailingAddressType !== ApplicationAddressTypeEnum.leasingAgent) {
      cy.getByID("mailInAnotherAddress").should("be.checked")
    }
    verifyDataIfExists(
      cy,
      "listingsApplicationMailingAddress.street",
      listing.listingsApplicationMailingAddress?.street,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsApplicationMailingAddress.street2",
      listing.listingsApplicationMailingAddress?.street2,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsApplicationMailingAddress.city",
      listing.listingsApplicationMailingAddress?.city,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsApplicationMailingAddress.zipCode",
      listing.listingsApplicationMailingAddress?.zipCode,
      "type"
    )
    verifyDataIfExists(
      cy,
      "listingsApplicationMailingAddress.state",
      listing.listingsApplicationMailingAddress?.state,
      "select"
    )

    // TODO - Testing pick up and drop off addresses
    cy.getByID("applicationsPickedUpNo").should("be.checked")
    cy.getByID("applicationsDroppedOffNo").should("be.checked")

    if (listing.postmarkDate) {
      cy.getByID("postmarksConsideredYes").should("be.checked")
      cy.getByTestId("postmark-date-field-month").should("have.value", listing.postmarkDate.month)
      cy.getByTestId("postmark-date-field-day").should("have.value", listing.postmarkDate.day)
      cy.getByTestId("postmark-date-field-year").should("have.value", listing.postmarkDate.year)
      cy.getByTestId("postmark-time-field-hours").should(
        "have.value",
        listing.postmarkDate.startHours
      )
      cy.getByTestId("postmark-time-field-minutes").should(
        "have.value",
        listing.postmarkDate.startMinutes
      )
      cy.getByTestId("postmark-time-field-period").should("have.value", listing.postmarkDate.period)
    }
    verifyDataIfExists(
      cy,
      "additionalApplicationSubmissionNotes",
      listing.additionalApplicationSubmissionNotes,
      "type"
    )

    // TODO Test Open house events
    if (listing.dueDate) {
      cy.getByID("applicationDueDateField.month").should("have.value", listing.dueDate.month)
      cy.getByID("applicationDueDateField.day").should("have.value", listing.dueDate.day)
      cy.getByID("applicationDueDateField.year").should("have.value", listing.dueDate.year)
      cy.getByID("applicationDueTimeField.hours").should("have.value", listing.dueDate.startHours)
      cy.getByID("applicationDueTimeField.minutes").should(
        "have.value",
        listing.dueDate.startMinutes
      )
      cy.getByID("applicationDueTimeField.period").should("have.value", listing.dueDate.period)
    }
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

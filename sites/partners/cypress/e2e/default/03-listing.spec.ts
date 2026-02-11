import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { bloomingtonListing } from "../../fixtures/bloomingtonListing"
import { CypressListing, CypressUnit } from "../../fixtures/cypressListingHelpers"
import { angelopolisListing } from "../../fixtures/angelopolisListing"

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
    cy.get("button").contains("Add listing").click()
    cy.getByID("jurisdiction").select("Bloomington")
    cy.get("button").contains("Get started").click()
    cy.contains("New listing")
    // Save an empty listing as a draft and should show errors for appropriate fields
    cy.getByID("saveDraftButton").contains("Save as draft").click()
    cy.contains("Please resolve any errors before saving or publishing your listing.")
    cy.getByID("name-error").contains("This field is required")
    // Fill out minimum fields and errors get removed
    cy.getByID("name").type("Test - error messaging")
    cy.getByID("name-error").should("to.be.empty")
    cy.getByID("saveDraftButton").contains("Save as draft").click()
    cy.contains("Test - error messaging")
    cy.contains("Listing data")
    // Try to publish a listing and should show errors for appropriate fields
    cy.getByID("listingEditButton").contains("Edit").click()
    cy.getByID("reservedCommunityTypes.id").select(1)
    cy.getByID("includeCommunityDisclaimerYes").check()
    cy.getByID("publishButton").contains("Publish").click()
    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.contains("Please resolve any errors before saving or publishing your listing.")
    cy.getByID("developer-error").contains("This field is required")
    cy.getByID("photos-error").contains("At least 1 image is required")
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
    cy.getByID("applicationProcessButton").contains("Application process").click()
    cy.getByID("leasingAgentName-error").contains("This field is required")
    cy.getByID("leasingAgentEmail-error").contains("This field is required")
    cy.getByID("leasingAgentPhone-error").contains("This field is required")
    cy.getByID("digitalApplicationChoice-error").contains("This field is required")
    cy.getByID("paperApplicationChoice-error").contains("This field is required")
    cy.getByID("referralOpportunityChoice-error").contains("This field is required")
    // Verify the behavior of Exit discard & confirm
    cy.contains("Listing details").click()
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

  it("error messaging publish with minimal fields", () => {
    cy.visit("/")
    cy.get("button").contains("Add listing").click()
    cy.getByID("jurisdiction").select("Lakeview")
    cy.get("button").contains("Get started").click()
    cy.contains("New listing")
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
    cy.getByID("applicationProcessButton").contains("Application process").click()
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

  const setupListingPublish = (listing: CypressListing) => {
    cy.visit("/")
    cy.get("button").contains("Add listing").click()
    cy.getByID("jurisdiction").select(listing.jurisdictions.id)
    cy.get("button").contains("Get started").click()
    cy.contains("New listing")
  }

  it("full listing publish in Bloomington", () => {
    setupListingPublish(bloomingtonListing)
    fillOutListing(cy, bloomingtonListing)
    verifyDetails(cy, bloomingtonListing)
    verifyAutofill(cy, bloomingtonListing)
    verifyOpenListingWarning(cy, bloomingtonListing)
  })

  it("full listing publish in Angelopolis", () => {
    setupListingPublish(angelopolisListing)
    fillOutListing(cy, angelopolisListing)
    verifyDetails(cy, angelopolisListing)
    verifyAutofill(cy, angelopolisListing)
  })

  // TODO - Full listing publish in Lakeview

  const getFlagActive = (listing: CypressListing, flagName: FeatureFlagEnum) => {
    return listing.jurisdiction.featureFlags?.find((flag) => flag.name === flagName && flag.active)
  }

  const fillIfDataExists = (
    cy: Cypress.cy,
    id: string,
    listingValue: string | boolean | undefined,
    entryType: "type" | "select" | "check"
  ) => {
    if (listingValue !== undefined && listingValue !== "") {
      switch (entryType) {
        case "type":
          cy.getByID(id).type(listingValue.toString())
          break
        case "select":
          cy.getByID(id).select(listingValue.toString())
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
    listingValue: string | boolean | undefined,
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

    // ----------
    // Section - Listing intro
    fillIfDataExists(cy, "name", listing.name, "type")
    fillIfDataExists(cy, "developer", listing.developer, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enableListingFileNumber)) {
      fillIfDataExists(cy, "listingFileNumber", listing.listingFileNumber, "type")
    }
    if (getFlagActive(listing, FeatureFlagEnum.enableProperties)) {
      cy.getByID("property.id")
        .find("option")
        .eq(1)
        .invoke("val")
        .then((val) => {
          cy.getByID("property.id").select(val as string)
        })
    }

    // ----------
    // Section - Listing photos
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

        if (
          getFlagActive(listing, FeatureFlagEnum.enableListingImageAltText) &&
          cypressImage.altText
        ) {
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

    // ----------
    // Section - Building details
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

    if (getFlagActive(listing, FeatureFlagEnum.enableRegions)) {
      fillIfDataExists(cy, "region", listing.region, "select")
    }

    if (getFlagActive(listing, FeatureFlagEnum.enableConfigurableRegions)) {
      fillIfDataExists(cy, "configurableRegion", listing.configurableRegion, "select")
    }

    cy.getByID("map-address-popup").contains(listing.listingsBuildingAddress.street)

    // ----------
    // Section - Community type
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

    // ----------
    // Section - Listing units

    if (getFlagActive(listing, FeatureFlagEnum.enableHomeType)) {
      fillIfDataExists(cy, "homeType", listing.homeType, "select")
    }
    fillRadio(cy, "unitTypes", "individual-units", listing.disableUnitsAccordion)

    // TODO - Test a waitlist listing
    if (
      listing.reviewOrderType === "firstComeFirstServe" ||
      listing.reviewOrderType === "lottery"
    ) {
      cy.getByID("availableUnits").check()
    } else {
      cy.getByID("openWaitlist").check()
    }

    listing.units.forEach((unit) => {
      cy.getByID("addUnitsButton").contains("Add unit").click()
      fillIfDataExists(cy, "number", unit.number, "type")
      fillIfDataExists(cy, "unitTypes.id", unit?.unitTypes?.id, "select")
      fillIfDataExists(cy, "numBathrooms", unit.numBathrooms?.toString(), "select")
      fillIfDataExists(cy, "floor", unit.floor?.toString(), "select")
      fillIfDataExists(cy, "sqFeet", unit.sqFeet, "type")
      fillIfDataExists(cy, "minOccupancy", unit.minOccupancy?.toString(), "select")
      fillIfDataExists(cy, "maxOccupancy", unit.maxOccupancy?.toString(), "select")

      fillIfDataExists(cy, "accessibilityPriorityType", unit?.accessibilityPriorityType, "select")

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
      cy.getByID("amiChart.id").find("option").should("have.length.greaterThan", 1)
      cy.getByID("amiChart.id").select(1).trigger("change")
      cy.getByID("amiPercentage").select(1)
      cy.get("button").contains("Save & exit").click()
    })

    // ----------
    // Section - Housing preferences
    if (!getFlagActive(listing, FeatureFlagEnum.disableListingPreferences)) {
      const listingPreferences =
        listing.listingMultiselectQuestions?.filter(
          (q) =>
            q.multiselectQuestions.applicationSection ===
            MultiselectQuestionsApplicationSectionEnum.preferences
        ) || []
      if (listingPreferences.length > 0) {
        cy.getByID("add-preferences-button").contains("Add preference").click()
        cy.getByID("select-preferences-button").contains("Select preferences").click()
        listingPreferences.forEach((pref) => {
          if (pref.multiselectQuestions.name) {
            cy.contains("label", pref.multiselectQuestions.name).click()
          }
        })
        cy.getByID("add-preferences-save-button").contains("Save").click()
        cy.getByID("select-and-order-save-button").contains("Save").click()
      }
    }

    // ----------
    // Section - Housing programs / Community types
    const listingPrograms =
      listing.listingMultiselectQuestions?.filter(
        (q) =>
          q.multiselectQuestions.applicationSection ===
          MultiselectQuestionsApplicationSectionEnum.programs
      ) || []
    if (listingPrograms.length > 0) {
      cy.getByID("add-programs-button").contains("Add program").click()
      cy.getByID("select-programs-button").contains("Select programs").click()
      listingPrograms.forEach((program) => {
        if (program.multiselectQuestions.name) {
          cy.contains("label", program.multiselectQuestions.name).click()
        }
      })
      cy.getByID("add-programs-save-button").contains("Save").click()
      cy.getByID("select-and-order-save-button").contains("Save").click()
    }

    // ----------
    // Section - Additional fees
    fillIfDataExists(cy, "applicationFee", listing.applicationFee, "type")
    fillIfDataExists(cy, "depositMin", listing.depositMin, "type")
    fillIfDataExists(cy, "depositMax", listing.depositMax, "type")
    fillIfDataExists(cy, "costsNotIncluded", listing.costsNotIncluded, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enableCreditScreeningFee)) {
      fillIfDataExists(cy, "creditScreeningFee", listing.creditScreeningFee, "type")
    }

    if (
      getFlagActive(listing, FeatureFlagEnum.enableUtilitiesIncluded) &&
      listing.listingUtilities
    ) {
      Object.keys(listing.listingUtilities).forEach((utility) => {
        if (listing.listingUtilities?.[utility as keyof typeof listing.listingUtilities] === true) {
          cy.getByID(utility.toLowerCase()).check()
        }
      })
    }

    // ----------
    // Section - Accessibility features
    if (
      getFlagActive(listing, FeatureFlagEnum.enableAccessibilityFeatures) &&
      listing.listingFeatures
    ) {
      const hasDrawer = listing.jurisdiction.listingFeaturesConfiguration?.categories?.length
      if (hasDrawer) {
        cy.getByID("addFeaturesButton").contains("Add features").click()
      }
      Object.keys(listing.listingFeatures).forEach((feature) => {
        if (listing.listingFeatures?.[feature as keyof typeof listing.listingFeatures] === true) {
          cy.getByID(`${hasDrawer ? "" : "configurableAccessibilityFeatures."}${feature}`).check({
            force: true,
          })
        }
      })
      if (hasDrawer) {
        cy.getByID("saveFeaturesButton").contains("Save").click()
      }
    }

    // ----------
    // Section - Building features
    fillIfDataExists(cy, "amenities", listing.amenities, "type")
    fillIfDataExists(cy, "accessibility", listing.accessibility, "type")
    fillIfDataExists(cy, "unitAmenities", listing.unitAmenities, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enablePetPolicyCheckbox)) {
      fillIfDataExists(cy, "allowsDogs", listing.allowsDogs, "check")
      fillIfDataExists(cy, "allowsCats", listing.allowsCats, "check")
    } else {
      fillIfDataExists(cy, "petPolicy", listing.petPolicy, "type")
    }

    if (getFlagActive(listing, FeatureFlagEnum.enableParkingFee)) {
      fillIfDataExists(cy, "parkingFee", listing.parkingFee, "type")
    }

    fillIfDataExists(cy, "servicesOffered", listing.servicesOffered, "type")
    if (getFlagActive(listing, FeatureFlagEnum.enableSmokingPolicyRadio)) {
      fillRadio(
        cy,
        "smokingPolicySmokingAllowed",
        "smokingPolicyNoSmokingAllowed",
        listing.smokingPolicy === "Smoking allowed"
      )
    } else {
      fillIfDataExists(cy, "smokingPolicy", listing.smokingPolicy, "type")
    }

    // ----------
    // Section - Neighborhood amenities
    if (
      getFlagActive(listing, FeatureFlagEnum.enableNeighborhoodAmenities) &&
      listing.listingNeighborhoodAmenities
    ) {
      if (getFlagActive(listing, FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown)) {
        Object.keys(listing.listingNeighborhoodAmenities).forEach((amenity) => {
          fillIfDataExists(
            cy,
            `listingNeighborhoodAmenities.${amenity}`,
            listing.listingNeighborhoodAmenities?.[
              amenity as keyof typeof listing.listingNeighborhoodAmenities
            ] as string,
            "select"
          )
        })
      } else {
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
    }

    // ----------
    // Section - Additional eligibility rules
    fillIfDataExists(cy, "creditHistory", listing.creditHistory, "type")
    fillIfDataExists(cy, "rentalHistory", listing.rentalHistory, "type")
    fillIfDataExists(cy, "criminalBackground", listing.criminalBackground, "type")

    // ----------
    // Section - Building selection criteria
    // TODO - Test building selection criteria PDF
    if (
      !getFlagActive(listing, FeatureFlagEnum.disableBuildingSelectionCriteria) &&
      listing.buildingSelectionCriteria
    ) {
      cy.getByID("addBuildingSelectionCriteriaButton")
        .contains("Add building selection criteria")
        .click()
      cy.getByID("criteriaAttachTypeURL").check()
      cy.getByID("buildingSelectionCriteriaURL").type(listing.buildingSelectionCriteria)
      cy.getByID("saveBuildingSelectionCriteriaButton").contains("Save").click()
    }

    // ----------
    // Section - Additional details
    fillIfDataExists(cy, "requiredDocuments", listing.requiredDocuments, "type")
    fillIfDataExists(cy, "programRules", listing.programRules, "type")
    fillIfDataExists(cy, "specialNotes", listing.specialNotes, "type")

    // Second tab
    cy.get("button").contains("Application process").click()

    // ----------
    // Section - Rankings and results
    if (listing.reviewOrderType === "firstComeFirstServe") {
      cy.getByID("reviewOrderFCFS").check()
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

    // ----------
    // Section - Leasing agent
    fillIfDataExists(cy, "leasingAgentName", listing.leasingAgentName, "type")
    fillIfDataExists(cy, "leasingAgentEmail", listing.leasingAgentEmail, "type")
    fillIfDataExists(cy, "leasingAgentPhone", listing.leasingAgentPhone, "type")
    fillIfDataExists(cy, "leasingAgentTitle", listing.leasingAgentTitle, "type")
    fillIfDataExists(cy, "leasingAgentOfficeHours", listing.leasingAgentOfficeHours, "type")
    fillIfDataExists(cy, "managementWebsite", listing.managementWebsite, "type")

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

    // ----------
    // Section - Application types
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
      fillIfDataExists(cy, "referralSummary", referralMethod.externalReference, "type")
    }

    // ----------
    // Section - Application address
    if (listing.listingsApplicationMailingAddress) {
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
    }

    if (listing.listingsApplicationPickUpAddress) {
      cy.getByID("applicationsPickedUpYes").check()
      cy.getByID("pickUpAnotherAddress").check()
      fillIfDataExists(
        cy,
        "listingsApplicationPickUpAddress.street",
        listing.listingsApplicationPickUpAddress?.street,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationPickUpAddress.street2",
        listing.listingsApplicationPickUpAddress?.street2,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationPickUpAddress.city",
        listing.listingsApplicationPickUpAddress?.city,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationPickUpAddress.zipCode",
        listing.listingsApplicationPickUpAddress?.zipCode,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationPickUpAddress.state",
        listing.listingsApplicationPickUpAddress?.state,
        "select"
      )
      fillIfDataExists(
        cy,
        "applicationPickUpAddressOfficeHours",
        listing.applicationPickUpAddressOfficeHours,
        "type"
      )
    }

    if (listing.listingsApplicationDropOffAddress) {
      cy.getByID("applicationsDroppedOffYes").check()
      cy.getByID("dropOffAnotherAddress").check()
      fillIfDataExists(
        cy,
        "listingsApplicationDropOffAddress.street",
        listing.listingsApplicationDropOffAddress?.street,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationDropOffAddress.street2",
        listing.listingsApplicationDropOffAddress?.street2,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationDropOffAddress.city",
        listing.listingsApplicationDropOffAddress?.city,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationDropOffAddress.zipCode",
        listing.listingsApplicationDropOffAddress?.zipCode,
        "type"
      )
      fillIfDataExists(
        cy,
        "listingsApplicationDropOffAddress.state",
        listing.listingsApplicationDropOffAddress?.state,
        "select"
      )
      fillIfDataExists(
        cy,
        "applicationDropOffAddressOfficeHours",
        listing.applicationDropOffAddressOfficeHours,
        "type"
      )
    }

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

    // ----------
    // Section - Application dates
    if (listing.dueDate) {
      cy.getByID("applicationDueDateField.month").type(listing.dueDate.month)
      cy.getByID("applicationDueDateField.day").type(listing.dueDate.day)
      cy.getByID("applicationDueDateField.year").type(listing.dueDate.year)
      cy.getByID("applicationDueTimeField.hours").type(listing.dueDate.startHours)
      cy.getByID("applicationDueTimeField.minutes").type(listing.dueDate.startMinutes)
      cy.getByID("applicationDueTimeField.period").select(listing.dueDate.period)
    }

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

    // TODO - Test under construction

    // TODO - Test marketing flyer PDFs
    if (getFlagActive(listing, FeatureFlagEnum.enableMarketingFlyer)) {
      const hasAnyFlyer = listing.marketingFlyer || listing.accessibleMarketingFlyer
      if (hasAnyFlyer) {
        cy.getByID("addMarketingFlyerButton").contains("Add marketing flyer").click()
        if (listing.marketingFlyer) {
          cy.getByID("marketingFlyerAttachTypeURL").check()
          cy.getByID("marketingFlyerURL").type(listing.marketingFlyer)
        }
        if (listing.accessibleMarketingFlyer) {
          cy.getByID("accessibleMarketingFlyerAttachTypeURL").check()
          cy.getByID("accessibleMarketingFlyerURL").type(listing.accessibleMarketingFlyer)
        }
        cy.getByID("saveMarketingFlyerButton").contains("Save").click()
      }
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

    // ----------
    // Section - Listing data
    cy.getByID("jurisdictions.name").contains(listing.jurisdiction.id)

    // ----------
    // Section - Listing intro
    verifyDetailDataIfExists(cy, "name", listing.name)
    verifyDetailDataIfExists(cy, "developer", listing.developer)

    if (getFlagActive(listing, FeatureFlagEnum.enableListingFileNumber)) {
      verifyDetailDataIfExists(cy, "listingFileNumber", listing.listingFileNumber)
    }

    // ----------
    // Section - Listing photos
    if (listing.cypressImages?.length) {
      listing.cypressImages.forEach((cypressImage, index) => {
        cy.getByID(`listing-detail-image-${index}`)
          .should("have.attr", "src")
          .should("include", cypressImage.fixtureName.replace(".jpg", ""))
      })
    }

    if (getFlagActive(listing, FeatureFlagEnum.enableListingImageAltText)) {
      listing.cypressImages?.forEach((cypressImage, index) => {
        if (cypressImage.altText) {
          cy.getByID(`listing-alt-text-${index}`).contains(cypressImage.altText)
        }
      })
    }

    // ----------
    // Section - Building details
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

    if (getFlagActive(listing, FeatureFlagEnum.enableRegions)) {
      if (getFlagActive(listing, FeatureFlagEnum.enableConfigurableRegions)) {
        verifyDetailDataIfExists(
          cy,
          "buildingAddress.configurableRegion",
          listing.configurableRegion
        )
      } else {
        verifyDetailDataIfExists(cy, "region", listing.region)
      }
    }

    // ----------
    // Section - Community type
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

    // ----------
    // Section - Listing units
    if (getFlagActive(listing, FeatureFlagEnum.enableHomeType)) {
      verifyDetailDataIfExists(cy, "homeType", capitalizeFirstLetter(listing.homeType))
    }

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

    listing.units?.forEach((unit: CypressUnit) => {
      verifyDetailDataIfExists(cy, "unitTable", unit.number)
      verifyDetailDataIfExists(cy, "unitTable", unit.sqFeet)
      verifyDetailDataIfExists(cy, "unitTable", unit.monthlyRent)
      verifyDetailDataIfExists(cy, "unitTable", unit.accessibilityPriorityTypeLabel)
    })

    // ----------
    // Section - Housing preferences
    if (!getFlagActive(listing, FeatureFlagEnum.disableListingPreferences)) {
      const listingPreferences =
        listing.listingMultiselectQuestions?.filter(
          (q) =>
            q.multiselectQuestions.applicationSection ===
            MultiselectQuestionsApplicationSectionEnum.preferences
        ) || []
      if (listingPreferences.length > 0) {
        listingPreferences.forEach((pref, index) => {
          if (pref.multiselectQuestions.name) {
            cy.getByID("preferenceTable").contains(index + 1)
            cy.getByID("preferenceTable").contains(pref.multiselectQuestions.name)
            cy.getByID("preferenceTable").contains(pref.multiselectQuestions.description || "")
          }
        })
      }
    }

    // ----------
    // Section - Housing programs / Community types
    const listingPrograms =
      listing.listingMultiselectQuestions?.filter(
        (q) =>
          q.multiselectQuestions.applicationSection ===
          MultiselectQuestionsApplicationSectionEnum.programs
      ) || []
    if (listingPrograms.length > 0) {
      listingPrograms.forEach((program, index) => {
        if (program.multiselectQuestions.name) {
          cy.getByID("programTable").contains(index + 1)
          cy.getByID("programTable").contains(program.multiselectQuestions.name)
          cy.getByID("programTable").contains(program.multiselectQuestions.description || "")
        }
      })
    }

    // ----------
    // Section - Additional fees
    verifyDetailDataIfExists(cy, "applicationFee", listing.applicationFee)
    verifyDetailDataIfExists(cy, "depositMin", listing.depositMin)
    verifyDetailDataIfExists(cy, "depositMax", listing.depositMax)
    verifyDetailDataIfExists(cy, "costsNotIncluded", listing.costsNotIncluded)

    if (getFlagActive(listing, FeatureFlagEnum.enableCreditScreeningFee)) {
      verifyDetailDataIfExists(cy, "creditScreeningFee", listing.creditScreeningFee)
    }

    if (
      getFlagActive(listing, FeatureFlagEnum.enableUtilitiesIncluded) &&
      listing.cypressUtilities
    ) {
      listing.cypressUtilities.forEach((utility) => {
        cy.getByID("utilities").contains(utility.translation)
      })
    }

    // ----------
    // Section - Accessibility features
    if (
      getFlagActive(listing, FeatureFlagEnum.enableAccessibilityFeatures) &&
      listing.cypressFeatures
    ) {
      listing.cypressFeatures.forEach((feature) => {
        cy.getByID("accessibilityFeatures").contains(feature.translation)
      })
    }

    // ----------
    // Section - Building features
    verifyDetailDataIfExists(cy, "amenities", listing.amenities)
    verifyDetailDataIfExists(cy, "unitAmenities", listing.unitAmenities)
    verifyDetailDataIfExists(cy, "accessibility", listing.accessibility)

    if (getFlagActive(listing, FeatureFlagEnum.enablePetPolicyCheckbox)) {
      if (listing.allowsDogs) {
        cy.getByID("petPolicy").contains("Allows dogs")
      }
      if (listing.allowsCats) {
        cy.getByID("petPolicy").contains("Allows cats")
      }
    } else {
      verifyDetailDataIfExists(cy, "petPolicy", listing.petPolicy)
    }

    if (getFlagActive(listing, FeatureFlagEnum.enableParkingFee)) {
      verifyDetailDataIfExists(cy, "parkingFee", listing.parkingFee)
    }

    verifyDetailDataIfExists(cy, "servicesOffered", listing.servicesOffered)

    if (getFlagActive(listing, FeatureFlagEnum.enableSmokingPolicyRadio)) {
      verifyDetailDataIfExists(
        cy,
        "smokingPolicy",
        listing.smokingPolicy === "Smoking allowed" ? "Smoking allowed" : "Non-smoking"
      )
    } else {
      verifyDetailDataIfExists(cy, "smokingPolicy", listing.smokingPolicy)
    }

    // ----------
    // Section - Neighborhood amenities
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

    // ----------
    // Section - Additional eligibility rules
    verifyDetailDataIfExists(cy, "creditHistory", listing["creditHistory"])
    verifyDetailDataIfExists(cy, "rentalHistory", listing["rentalHistory"])
    verifyDetailDataIfExists(cy, "criminalBackground", listing["criminalBackground"])
    // TODO - Allow for dynamic rental assistance text
    verifyDetailDataIfExists(
      cy,
      "rentalAssistance",
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy."
    )

    // ----------
    // Section - Building selection criteria
    if (!getFlagActive(listing, FeatureFlagEnum.disableBuildingSelectionCriteria)) {
      verifyDetailDataIfExists(
        cy,
        "buildingSelectionCriteriaTable",
        listing["buildingSelectionCriteria"]
      )
    }

    // ----------
    // Section - Additional details
    verifyDetailDataIfExists(cy, "requiredDocuments", listing["requiredDocuments"])
    verifyDetailDataIfExists(cy, "programRules", listing["programRules"])
    verifyDetailDataIfExists(cy, "specialNotes", listing["specialNotes"])

    // ----------
    // Section - Rankings and results
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

    // ----------
    // Section - Leasing agent
    verifyDetailDataIfExists(cy, "leasingAgentName", listing.leasingAgentName)
    verifyDetailDataIfExists(cy, "leasingAgentEmail", listing.leasingAgentEmail?.toLowerCase())
    verifyDetailDataIfExists(cy, "leasingAgentPhone", formatPhoneNumber(listing.leasingAgentPhone))
    verifyDetailDataIfExists(cy, "leasingAgentOfficeHours", listing.leasingAgentOfficeHours)
    verifyDetailDataIfExists(cy, "leasingAgentTitle", listing.leasingAgentTitle)
    verifyDetailDataIfExists(cy, "managementWebsite", listing.managementWebsite)

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

    // ----------
    // Section - Application types
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
      verifyDetailDataIfExists(
        cy,
        "referralSummary",
        formatPhoneNumber(referralMethod.externalReference)
      )
    } else {
      cy.getByID("referralOpportunity").contains("No")
    }

    // ----------
    // Section - Application address

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
    if (listing.listingsApplicationPickUpAddress) {
      cy.getByID("applicationPickupQuestion").contains("Yes")
      verifyDetailDataIfExists(
        cy,
        "applicationPickUpAddress.street",
        listing.listingsApplicationPickUpAddress?.street
      )
      verifyDetailDataIfExists(
        cy,
        "applicationPickUpAddress.street2",
        listing.listingsApplicationPickUpAddress?.street2
      )
      verifyDetailDataIfExists(
        cy,
        "applicationPickUpAddress.city",
        listing.listingsApplicationPickUpAddress?.city
      )
      verifyDetailDataIfExists(
        cy,
        "applicationPickUpAddress.zipCode",
        listing.listingsApplicationPickUpAddress?.zipCode
      )
      verifyDetailDataIfExists(
        cy,
        "applicationPickUpAddress.state",
        listing.listingsApplicationPickUpAddress?.abbreviatedState
      )
      verifyDetailDataIfExists(
        cy,
        "applicationPickUpAddressOfficeHours",
        listing.applicationPickUpAddressOfficeHours
      )
    } else {
      cy.getByID("applicationPickupQuestion").contains("No")
    }
    if (listing.listingsApplicationDropOffAddress) {
      cy.getByID("applicationDropOffQuestion").contains("Yes")
      verifyDetailDataIfExists(
        cy,
        "applicationDropOffAddress.street",
        listing.listingsApplicationDropOffAddress?.street
      )
      verifyDetailDataIfExists(
        cy,
        "applicationDropOffAddress.street2",
        listing.listingsApplicationDropOffAddress?.street2
      )
      verifyDetailDataIfExists(
        cy,
        "applicationDropOffAddress.city",
        listing.listingsApplicationDropOffAddress?.city
      )
      verifyDetailDataIfExists(
        cy,
        "applicationDropOffAddress.zipCode",
        listing.listingsApplicationDropOffAddress?.zipCode
      )
      verifyDetailDataIfExists(
        cy,
        "applicationDropOffAddress.state",
        listing.listingsApplicationDropOffAddress?.abbreviatedState
      )
      verifyDetailDataIfExists(
        cy,
        "applicationDropOffAddressOfficeHours",
        listing.applicationDropOffAddressOfficeHours
      )
    } else {
      cy.getByID("applicationDropOffQuestion").contains("No")
    }

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

    // ----------
    // Section - Application dates
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

    if (getFlagActive(listing, FeatureFlagEnum.enableMarketingFlyer)) {
      if (listing.marketingFlyer) {
        cy.getByID("Marketing flyer url").contains(listing.marketingFlyer)
      }
      if (listing.accessibleMarketingFlyer) {
        cy.getByID("Accessible marketing flyer url").contains(listing.accessibleMarketingFlyer)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function verifyAutofill(cy: Cypress.cy, listing: CypressListing): void {
    cy.findAndOpenListing(listing.name)
    cy.getByID("listingEditButton").contains("Edit").click()

    // ----------
    // Section - Listing intro
    verifyDataIfExists(cy, "name", listing.name, "type")
    verifyDataIfExists(cy, "developer", listing.developer, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enableListingFileNumber)) {
      verifyDataIfExists(cy, "listingFileNumber", listing.listingFileNumber, "type")
    }

    // ----------
    // Section - Building details
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

    if (getFlagActive(listing, FeatureFlagEnum.enableRegions)) {
      if (getFlagActive(listing, FeatureFlagEnum.enableConfigurableRegions)) {
        verifyDataIfExists(cy, "configurableRegion", listing.configurableRegion, "select")
      } else {
        verifyDataIfExists(cy, "region", listing.region, "select")
      }
    }

    // ----------
    // Section - Community type
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

    // ----------
    // Section - Listing units
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

    // ----------
    // Section - Additional fees
    verifyDataIfExists(cy, "applicationFee", listing.applicationFee, "type")
    verifyDataIfExists(cy, "depositMin", listing.depositMin, "type")
    verifyDataIfExists(cy, "depositMax", listing.depositMax, "type")
    verifyDataIfExists(cy, "costsNotIncluded", listing.costsNotIncluded, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enableCreditScreeningFee)) {
      verifyDataIfExists(cy, "creditScreeningFee", listing.creditScreeningFee, "type")
    }

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

    // ----------
    // Section - Accessibility features
    if (
      getFlagActive(listing, FeatureFlagEnum.enableAccessibilityFeatures) &&
      listing.listingFeatures
    ) {
      const hasDrawer = listing.jurisdiction.listingFeaturesConfiguration?.categories?.length
      if (hasDrawer) {
        cy.getByID("addFeaturesButton").contains("Edit features").click()
      }
      Object.keys(listing.listingFeatures).forEach((feature) => {
        verifyDataIfExists(
          cy,
          `${hasDrawer ? "" : "configurableAccessibilityFeatures."}${feature}`,
          listing.listingFeatures?.[feature as keyof typeof listing.listingFeatures] ? "true" : "",
          "check"
        )
      })
      if (hasDrawer) {
        cy.getByID("saveFeaturesButton").contains("Save").click()
      }
    }

    // ----------
    // Section - Building features
    verifyDataIfExists(cy, "amenities", listing.amenities, "type")
    verifyDataIfExists(cy, "accessibility", listing.accessibility, "type")
    verifyDataIfExists(cy, "unitAmenities", listing.unitAmenities, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enablePetPolicyCheckbox)) {
      verifyDataIfExists(cy, "allowsDogs", listing.allowsDogs, "check")
      verifyDataIfExists(cy, "allowsCats", listing.allowsCats, "check")
    } else {
      verifyDataIfExists(cy, "petPolicy", listing.petPolicy, "type")
    }

    if (getFlagActive(listing, FeatureFlagEnum.enableParkingFee)) {
      verifyDataIfExists(cy, "parkingFee", listing.parkingFee, "type")
    }

    verifyDataIfExists(cy, "servicesOffered", listing.servicesOffered, "type")

    if (getFlagActive(listing, FeatureFlagEnum.enableSmokingPolicyRadio)) {
      verifyRadioIfExists(
        cy,
        "smokingPolicySmokingAllowed",
        "smokingPolicyNoSmokingAllowed",
        listing.smokingPolicy === "Smoking allowed"
      )
    } else {
      verifyDataIfExists(cy, "smokingPolicy", listing.smokingPolicy, "type")
    }

    // ----------
    // Section - Neighborhood amenities
    if (listing.listingNeighborhoodAmenities) {
      if (getFlagActive(listing, FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown)) {
        Object.keys(listing.listingNeighborhoodAmenities).forEach((amenity) => {
          verifyDataIfExists(
            cy,
            `listingNeighborhoodAmenities.${amenity}`,
            listing.listingNeighborhoodAmenities?.[
              amenity as keyof typeof listing.listingNeighborhoodAmenities
            ] as string,
            "select"
          )
        })
      } else {
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
    }

    // ----------
    // Section - Additional eligibility rules
    verifyDataIfExists(cy, "creditHistory", listing.creditHistory, "type")
    verifyDataIfExists(cy, "rentalHistory", listing.rentalHistory, "type")
    verifyDataIfExists(cy, "criminalBackground", listing.criminalBackground, "type")
    verifyDataIfExists(cy, "rentalAssistance", listing.rentalAssistance, "type")

    // ----------
    // Section - Building selection criteria
    if (!getFlagActive(listing, FeatureFlagEnum.disableBuildingSelectionCriteria)) {
      verifyDetailDataIfExists(
        cy,
        "buildingSelectionCriteriaTable",
        listing["buildingSelectionCriteria"]
      )
    }

    // ----------
    // Section - Additional details
    verifyDataIfExists(cy, "requiredDocuments", listing.requiredDocuments, "type")
    verifyDataIfExists(cy, "programRules", listing.programRules, "type")
    verifyDataIfExists(cy, "specialNotes", listing.specialNotes, "type")

    // Second tab
    cy.get("button").contains("Application process").click()

    // ----------
    // Section - Rankings and results
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

    // ----------
    // Section - Leasing agent
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
    verifyDataIfExists(cy, "managementWebsite", listing.managementWebsite, "type")

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

    // ----------
    // Section - Application types
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

    // ----------
    // Section - Application address
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

    if (listing.listingsApplicationPickUpAddress) {
      cy.getByID("applicationsPickedUpYes").should("be.checked")
      verifyDataIfExists(
        cy,
        "listingsApplicationPickUpAddress.street",
        listing.listingsApplicationPickUpAddress?.street,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationPickUpAddress.street2",
        listing.listingsApplicationPickUpAddress?.street2,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationPickUpAddress.city",
        listing.listingsApplicationPickUpAddress?.city,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationPickUpAddress.zipCode",
        listing.listingsApplicationPickUpAddress?.zipCode,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationPickUpAddress.state",
        listing.listingsApplicationPickUpAddress?.state,
        "select"
      )
      verifyDataIfExists(
        cy,
        "applicationPickUpAddressOfficeHours",
        listing.applicationPickUpAddressOfficeHours,
        "type"
      )
    } else {
      cy.getByID("applicationsPickedUpNo").should("be.checked")
    }

    if (listing.listingsApplicationDropOffAddress) {
      cy.getByID("applicationsDroppedOffYes").should("be.checked")
      verifyDataIfExists(
        cy,
        "listingsApplicationDropOffAddress.street",
        listing.listingsApplicationDropOffAddress?.street,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationDropOffAddress.street2",
        listing.listingsApplicationDropOffAddress?.street2,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationDropOffAddress.city",
        listing.listingsApplicationDropOffAddress?.city,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationDropOffAddress.zipCode",
        listing.listingsApplicationDropOffAddress?.zipCode,
        "type"
      )
      verifyDataIfExists(
        cy,
        "listingsApplicationDropOffAddress.state",
        listing.listingsApplicationDropOffAddress?.state,
        "select"
      )
      verifyDataIfExists(
        cy,
        "applicationDropOffAddressOfficeHours",
        listing.applicationDropOffAddressOfficeHours,
        "type"
      )
    } else {
      cy.getByID("applicationsDroppedOffNo").should("be.checked")
    }

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
    } else {
      cy.getByID("postmarksConsideredNo").should("be.checked")
    }
    verifyDataIfExists(
      cy,
      "additionalApplicationSubmissionNotes",
      listing.additionalApplicationSubmissionNotes,
      "type"
    )

    // ----------
    // Section - Application dates
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

    const openHouseEvents = listing.events.filter((e) => e.type === "openHouse")
    if (openHouseEvents.length > 0) {
      openHouseEvents.forEach((event, index) => {
        cy.getByID(`editOpenHouseButton-${index}`).contains("Edit").click()
        cy.getByID("date.month").should("have.value", event.dateTime.month)
        cy.getByID("date.day").should("have.value", event.dateTime.day)
        cy.getByID("date.year").should("have.value", event.dateTime.year)
        verifyDataIfExists(cy, "label", event.label, "type")
        verifyDataIfExists(cy, "url", event.url, "type")
        cy.getByID("startTime.hours").should("have.value", event.dateTime.startHours)
        cy.getByID("startTime.minutes").should("have.value", event.dateTime.startMinutes)
        cy.getByID("endTime.hours").should("have.value", event.dateTime.endHours)
        cy.getByID("endTime.minutes").should("have.value", event.dateTime.endMinutes)
        verifyDataIfExists(cy, "note", event.note, "type")
        cy.getByID("startTime.period").should("have.value", event.dateTime.period)
        cy.getByID("endTime.period").should("have.value", event.dateTime.period)
        cy.getByID("saveOpenHouseFormButton").contains("Save").click()
      })
    }

    if (getFlagActive(listing, FeatureFlagEnum.enableMarketingFlyer)) {
      const hasAnyFlyer = listing.marketingFlyer || listing.accessibleMarketingFlyer
      if (hasAnyFlyer) {
        cy.getByID("addMarketingFlyerButton").contains("Edit marketing flyer").click()
        if (listing.marketingFlyer) {
          cy.getByID("marketingFlyerAttachTypeURL").should("be.checked")
          verifyDataIfExists(cy, "marketingFlyerURL", listing.marketingFlyer, "type")
        }
        if (listing.accessibleMarketingFlyer) {
          cy.getByID("accessibleMarketingFlyerAttachTypeURL").should("be.checked")
          verifyDataIfExists(
            cy,
            "accessibleMarketingFlyerURL",
            listing.accessibleMarketingFlyer,
            "type"
          )
        }
        cy.getByID("saveMarketingFlyerButton").contains("Save").click()
      }
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

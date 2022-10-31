describe("Listing Management Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  const listingDetailsFieldsToType = [
    { fieldID: "name" },
    { fieldID: "developer" },
    { fieldID: "buildingAddress.street" },
    { fieldID: "buildingAddress.city" },
    { fieldID: "buildingAddress.zipCode" },
    { fieldID: "yearBuilt" },
    { fieldID: "applicationFee" },
    { fieldID: "depositMin", hardcodedValue: "02" },
    { fieldID: "depositMax", hardcodedValue: "0100" },
    { fieldID: "costsNotIncluded" },
    { fieldID: "amenities" },
    { fieldID: "neighborhoodAmenities.grocery" },
    { fieldID: "neighborhoodAmenities.pharmacy" },
    { fieldID: "neighborhoodAmenities.medicalClinic" },
    { fieldID: "neighborhoodAmenities.park" },
    { fieldID: "neighborhoodAmenities.seniorCenter" },
    { fieldID: "accessibility" },
    { fieldID: "unitAmenities" },
    { fieldID: "smokingPolicy" },
    { fieldID: "petPolicy" },
    { fieldID: "servicesOffered" },
    { fieldID: "creditHistory" },
    { fieldID: "rentalHistory" },
    { fieldID: "criminalBackground" },
    { fieldID: "requiredDocuments" },
    { fieldID: "programRules" },
    { fieldID: "specialNotes" },
  ]

  const listingDetailsFieldsToSelect = [
    { fieldID: "jurisdiction.id" },
    { fieldID: "neighborhood" },
    { fieldID: "buildingAddress.state", hardcodedValue: "CA" },
  ]

  const unitFormFieldsToType = [
    { fieldID: "totalCount", byTestID: true },
    { fieldID: "sqFeetMin", byTestID: true },
    { fieldID: "sqFeetMax", byTestID: true },
    { fieldID: "totalAvailable", byTestID: true },
  ]

  const unitFormFieldsToSelect = [
    { fieldID: "minOccupancy", byTestID: true },
    { fieldID: "maxOccupancy", byTestID: true },
    { fieldID: "floorMin", byTestID: true },
    { fieldID: "floorMax", byTestID: true },
    { fieldID: "bathroomMin", byTestID: true },
    { fieldID: "bathroomMax", byTestID: true },
  ]

  const amiFormFieldsToType = [{ fieldID: "flatRentValue", byTestID: true }]

  const amiFormFieldsToSelect = [
    { fieldID: "amiChartId", byTestID: true },
    { fieldID: "amiPercentage", byTestID: true },
  ]

  const applicationDetailsFieldsToType = [
    { fieldID: "leasingAgentName", byTestID: true },
    { fieldID: "leasingAgentEmail", byTestID: true, hardcodedValue: "basicagent@email.com" },
    { fieldID: "leasingAgentPhone", byTestID: true, hardcodedValue: "(520) 245-8811" },
    { fieldID: "leasingAgentTitle", byTestID: true },
    { fieldID: "leasingAgentOfficeHours", byTestID: true },
    { fieldID: "leasingAgentAddress.street", byTestID: true },
    { fieldID: "leasingAgentAddress.street2", byTestID: true },
    { fieldID: "leasingAgentAddress.city", byTestID: true },
    { fieldID: "leasingAgentAddress.zipCode", byTestID: true },
    { fieldID: "mailing-address-street", byTestID: true, fixtureID: "leasingAgentAddress.street" },
    {
      fieldID: "mailing-address-street2",
      byTestID: true,
      fixtureID: "leasingAgentAddress.street2",
    },
    { fieldID: "mailing-address-city", byTestID: true, fixtureID: "leasingAgentAddress.city" },
    { fieldID: "mailing-address-zip", byTestID: true, fixtureID: "leasingAgentAddress.zipCode" },
    { fieldID: "postmark-date-field-month", byTestID: true },
    { fieldID: "postmark-date-field-day", byTestID: true },
    { fieldID: "postmark-date-field-year", byTestID: true },
    { fieldID: "postmark-time-field-hours", byTestID: true },
    { fieldID: "postmark-time-field-minutes", byTestID: true },
  ]

  const applicationDetailsFieldsToSelect = [
    { fieldID: "leasingAgentAddress.state", byTestID: true, hardcodedValue: "CA" },
    {
      fieldID: "mailing-address-state",
      byTestID: true,
      fixtureID: "leasingAgentAddress.state",
      hardcodedValue: "CA",
    },
    { fieldID: "postmark-time-field-period", byTestID: true },
  ]

  it("full listing publish", () => {
    cy.visit("/")
    cy.get("a > .button").contains("Add Listing").click()
    cy.contains("New Listing")

    // Test photo upload
    cy.getByTestId("add-photos-button").contains("Add Photo").click()
    cy.getByTestId("dropzone-input").attachFile(
      "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg",
      {
        subjectType: "drag-n-drop",
      }
    )
    cy.getByTestId("drawer-photos-table").contains(
      "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96"
    )
    cy.getByTestId("listing-photo-uploaded").contains("Save").click()
    cy.getByTestId("photos-table").contains(
      "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96"
    )

    cy.getByTestId("add-photos-button").contains("Edit Photos").click()
    cy.getByTestId("dropzone-input").attachFile(
      "cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08.jpg",
      {
        subjectType: "drag-n-drop",
      }
    )
    cy.getByTestId("drawer-photos-table").contains(
      "cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08"
    )
    cy.getByTestId("listing-photo-uploaded").contains("Save").click()
    cy.getByTestId("photos-table").contains(
      "cypress-automated-image-upload-46806882-b98d-49d7-ac83-8016ab4b2f08"
    )
    cy.getByTestId("photos-table").get("tbody > tr").should("have.length", 2)
    cy.getByTestId("photos-table")
      .get("tbody > tr:nth-of-type(2)")
      .should("not.contain", "Primary photo")

    // Fill out a bunch of fields
    cy.fillFormFields("listing", listingDetailsFieldsToType, listingDetailsFieldsToSelect)

    // Add units
    cy.getByTestId("addUnitsButton").contains("Add unit group").click()
    cy.get(`[data-test-id="unitTypeCheckBox"]`).first().click()
    cy.get(`[data-test-id="openWaitListQuestion"]`).last().click()
    cy.fillFormFields("listing", unitFormFieldsToType, unitFormFieldsToSelect)

    // Add AMI data
    cy.getByTestId("openAmiDrawer").contains("Add AMI level").click()
    cy.fillFormFields("listing", amiFormFieldsToType, amiFormFieldsToSelect)
    cy.getByTestId("saveAmi").click()
    cy.getByTestId("saveUnit").click()

    cy.fixture("listing").then((listing) => {
      cy.get(".addressPopup").contains(listing["buildingAddress.street"])
      cy.get("#addBuildingSelectionCriteriaButton")
        .contains("Add Building Selection Criteria")
        .click()
      cy.get("#criteriaAttachTypeURL").check()
      cy.getByID("buildingSelectionCriteriaURL").type(listing["buildingSelectionCriteriaURL"])
    })

    cy.get(".p-4 > .is-primary").contains("Save").click()
    cy.get(".text-right > .button").contains("Application Process").click()
    cy.get("#reviewOrderFCFS").check()
    cy.get("#dueDateQuestionNo").check()
    cy.get("#waitlistOpenNo").check()
    cy.get("#digitalApplicationChoiceYes").check()
    cy.get("#paperApplicationNo").check()
    cy.get("#applicationsMailedInYes").check()
    cy.get("#mailInAnotherAddress").check()
    cy.get("#applicationsPickedUpNo").check()
    cy.get("#applicationsDroppedOffNo").check()
    cy.get("#postmarksConsideredYes").check()
    cy.fillFormFields("listing", applicationDetailsFieldsToType, applicationDetailsFieldsToSelect)

    cy.get("#publishButton").contains("Publish").click()
    cy.get("#publishButtonConfirm").contains("Publish").click()
    cy.fixture("listing").then((listing) => {
      cy.get(".page-header__title > .font-semibold").contains(listing["name"])
    })

    //verify the details section is correct
    const fieldsToVerify = [
      ...listingDetailsFieldsToType,
      ...listingDetailsFieldsToSelect,
      ...applicationDetailsFieldsToType,
      ...applicationDetailsFieldsToSelect,
    ]

    cy.verifyFormFields(
      "listing",
      fieldsToVerify.reduce((accum, elem) => {
        if (elem.fieldID === "jurisdiction.id") {
          accum.push({ fieldID: "jurisdiction.name", fixtureID: "jurisdiction.id" })
        } else if (elem.fieldID === "mailing-address-street") {
          accum.push({ ...elem, fieldID: "applicationMailingAddress.street" })
        } else if (elem.fieldID === "mailing-address-street2") {
          accum.push({ ...elem, fieldID: "applicationMailingAddress.street2" })
        } else if (elem.fieldID === "mailing-address-city") {
          accum.push({ ...elem, fieldID: "applicationMailingAddress.city" })
        } else if (elem.fieldID === "mailing-address-zip") {
          accum.push({ ...elem, fieldID: "applicationMailingAddress.zipCode" })
        } else if (elem.fieldID === "mailing-address-state") {
          accum.push({ ...elem, fieldID: "applicationMailingAddress.state" })
        } else if (elem.fieldID === "postmark-date-field-month") {
          // skip this one
        } else if (elem.fieldID === "postmark-date-field-day") {
          // skip this one
        } else if (elem.fieldID === "postmark-date-field-year") {
          // skip this one
        } else if (elem.fieldID === "postmark-time-field-hours") {
          // skip this one
        } else if (elem.fieldID === "postmark-time-field-minutes") {
          // skip this one
        } else if (elem.fieldID === "postmark-time-field-period") {
          // skip this one
        } else {
          accum.push(elem)
        }
        return accum
      }, [] as fillFromFieldOption[])
    )

    cy.get("#longitude").contains("-122.40078")
    cy.get("#latitude").contains("37.79006")
    cy.get("#unitTable").contains("Unit Type")
    cy.getByID("waitlist.openQuestion").contains("No")
    cy.get("#digitalApplication").contains("Yes")
    cy.getByID("digitalMethod.type").contains("No")
    cy.get("#paperApplication").contains("No")
    cy.getByID("applicationPickupQuestion").contains("No")
    cy.getByID("applicationMailingSection").contains("Yes")
    cy.get("#applicationDropOffQuestion").contains("No")
    cy.get("#postmarksConsideredQuestion").contains("Yes")

    cy.fixture("listing").then((listing) => {
      cy.get("#unitTable").contains(listing["totalCount"])
      cy.get("#unitTable").contains(`${listing["amiPercentage"]}%`)
      cy.get("#unitTable").contains(`$${listing["flatRentValue"]}`)
      cy.get("#unitTable").contains(`${listing["minOccupancy"]} - ${listing["maxOccupancy"]}`)
      cy.get("#unitTable").contains(`${listing["sqFeetMin"]} - ${listing["sqFeetMax"]}`)
      cy.get("#unitTable").contains(`${listing["bathroomMin"]} - ${listing["bathroomMax"]}`)
      cy.get("#postmarkedApplicationsReceivedByDate").contains(
        `${listing["postmark-date-field-month"]}/${listing["postmark-date-field-day"]}/${listing["postmark-date-field-year"]}`
      )
      cy.get("#postmarkedApplicationsReceivedByDateTime").contains(
        `${listing["postmark-time-field-hours"]}:${listing["postmark-time-field-minutes"]} ${listing["postmark-time-field-period"]}`
      )
    })

    // try editing the listing
    cy.fixture("listing").then((listing) => {
      cy.getByTestId("listingEditButton").contains("Edit").click()
      cy.getByTestId("nameField").type(" (Edited)")
      cy.getByTestId("saveAndExitButton").contains("Save & Exit").click()
      cy.getByTestId("listingIsAlreadyLiveButton").contains("Save").click()
      cy.getByTestId("page-header-text").should("have.text", `${listing["name"]} (Edited)`)
    })
  })
})

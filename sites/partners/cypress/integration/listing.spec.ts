describe("Listing Management Tests", () => {
  before(() => {
    cy.login()
  })

  describe("full new listing save", () => {
    it("fill listing intro section", () => {
      cy.visit("/")
      cy.get("a > .button").contains("Add Listing").click()
      cy.contains("New Listing")
      cy.fixture("listing").then((listing) => {
        cy.getByID("jurisdiction.id").select(listing["jurisdiciton.id"])
        cy.get("#name").type(listing["name"])
        cy.get("#developer").type(listing["developer"])
      })
    })

    it("fill listing photo section", () => {
      cy.get(":nth-child(2) > .grid-section > .grid-section__inner > .grid-item > .button")
        .contains("Add Photo")
        .click()
      cy.getByID("listing-photo-upload").attachFile("exygy.jpeg", {
        subjectType: "input",
      })
      cy.get('[data-label="File Name"]').contains("exygy")
      cy.get(".p-4 > .is-primary").contains("Save").click()
    })

    it("fill building details section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("buildingAddress.street").type(listing["buildingAddress.street"])
        cy.getByID("neighborhood").type(listing["neighborhood"])
        cy.getByID("buildingAddress.city").type(listing["buildingAddress.city"])
        cy.getByID("buildingAddress.state").select(listing["buildingAddress.state"])
        cy.getByID("buildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
        cy.getByID("yearBuilt").type(listing["yearBuilt"])
        cy.get(".addressPopup").contains(listing["buildingAddress.street"])
      })
    })

    it("fill community type section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("reservedCommunityType.id").select(listing["reservedCommunityType.id"])
        cy.getByID("reservedCommunityDescription").type(listing["reservedCommunityDescription"])
      })
    })

    it("fill listing units section", () => {
      cy.get(
        ":nth-child(8) > :nth-child(2) > .grid-section > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Unit Types")
        .click()
      cy.get(":nth-child(8) > :nth-child(2) > .bg-gray-300 > .button").contains("Add Unit").click()
    })

    it("fill unit: details section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("number").type(listing["number"])
        cy.getByID("unitType.id").select(listing["unitType.id"])
        cy.getByID("numBathrooms").select(listing["numBathrooms"])
        cy.getByID("floor").select(listing["floor"])
        cy.getByID("sqFeet").type(listing["sqFeet"])
        cy.getByID("minOccupancy").select(listing["minOccupancy"])
        cy.getByID("maxOccupancy").select(listing["maxOccupancy"])
      })
    })

    it("fill unit: eligibility section", () => {
      cy.fixture("listing").then((listing) => {
        cy.get(".view-item__value > .flex > :nth-child(1) > .font-semibold")
          .contains("Fixed amount")
          .click()
        cy.getByID("monthlyIncomeMin").type(listing["monthlyIncomeMin"])
        cy.getByID("monthlyRent").type(listing["monthlyRent"])
      })
    })

    it("fill unit: accessibility section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("priorityType.id").select(listing["priorityType.id"])
        cy.get(".mt-6 > .is-primary").contains("Save & Exit").click()
      })
    })

    it("fill preference section", () => {
      cy.get(":nth-child(10) > .grid-section__inner > .bg-gray-300 > .button")
        .contains("Add Preference")
        .click()
      cy.get(".border > .button").contains("Select Preferences").click()
      cy.get(":nth-child(1) > .grid-section__inner > .field > div > .label")
        .contains("Live/Work in County")
        .click()
      cy.get(
        ':nth-child(6) > .fixed-overlay > .fixed-overlay__inner > [data-focus-lock-disabled="false"] > .drawer > .drawer__body > .drawer__content > .button'
      )
        .contains("Save")
        .click()

      cy.get(".drawer__content > .is-primary").contains("Save").click()
    })

    it("fill additional fees section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("applicationFee").type(listing["applicationFee"])
        cy.getByID("depositMin").type(listing["depositMin"])
        cy.getByID("depositMax").type(listing["depositMax"])
        cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
      })
    })

    it("fill building features section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("applicationFee").type(listing["applicationFee"])
        cy.getByID("depositMin").type(listing["depositMin"])
        cy.getByID("depositMax").type(listing["depositMax"])
        cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
      })
    })

    it("fill building features section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("amenities").type(listing["amenities"])
        cy.getByID("accessibility").type(listing["accessibility"])
        cy.getByID("unitAmenities").type(listing["unitAmenities"])
        cy.getByID("smokingPolicy").type(listing["smokingPolicy"])
        cy.getByID("petPolicy").type(listing["petPolicy"])
        cy.getByID("servicesOffered").type(listing["servicesOffered"])
      })
    })

    it("fill additional eligibilty section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("creditHistory").type(listing["creditHistory"])
        cy.getByID("rentalHistory").type(listing["rentalHistory"])
        cy.getByID("criminalBackground").type(listing["criminalBackground"])
        cy.get(":nth-child(18) > .grid-section__inner > .grid-item > .button")
          .contains("Add Building Selection Criteria")
          .click()
        cy.get(".border > :nth-child(1) > .flex > :nth-child(2) > .font-semibold")
          .contains("Webpage URL")
          .click()
        cy.getByID("buildingSelectionCriteriaURL").type(listing["buildingSelectionCriteriaURL"])
        cy.get(".p-4 > .is-primary").contains("Save").click()
      })
    })

    it("fill additional details section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("requiredDocuments").type(listing["requiredDocuments"])
        cy.getByID("programRules").type(listing["programRules"])
        cy.getByID("specialNotes").type(listing["specialNotes"])
      })
    })

    it("progress to application process", () => {
      cy.get(".text-right > .button").contains("Application Process").click()
    })

    it("fill rankings & results section", () => {
      cy.get(
        ":nth-child(1) > :nth-child(2) > :nth-child(1) > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("First come first serve")
        .click()
      cy.get(
        ":nth-child(1) > :nth-child(2) > :nth-child(2) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
      cy.get(
        ":nth-child(1) > :nth-child(2) > :nth-child(3) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
    })

    it("fill leasing agent section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
        cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
        cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
        cy.getByID("leasingAgentTitle").type(listing["leasingAgentTitle"])
        cy.getByID("leasingAgentOfficeHours").type(listing["leasingAgentOfficeHours"])
      })
    })

    it("fill application types section", () => {
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(1) > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Yes")
        .click()
      cy.get(
        ":nth-child(1) > .grid-section__inner > :nth-child(2) > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Yes")
        .click()
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(2) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(3) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
    })

    it("fill application address section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("leasingAgentAddress.street").type(listing["leasingAgentAddress.street"])
        cy.getByID("leasingAgentAddress.street2").type(listing["leasingAgentAddress.street2"])
        cy.getByID("leasingAgentAddress.city").type(listing["leasingAgentAddress.city"])
        cy.getByID("leasingAgentAddress.zipCode").type(listing["leasingAgentAddress.zipCode"])
        cy.getByID("leasingAgentAddress.state").select(listing["leasingAgentAddress.state"])

        cy.get(
          ":nth-child(4) > .grid-section__inner > :nth-child(1) > .flex > :nth-child(2) > .font-semibold"
        )
          .contains("No")
          .click()
        cy.get(
          ":nth-child(4) > .grid-section__inner > :nth-child(2) > .flex > :nth-child(2) > .font-semibold"
        )
          .contains("No")
          .click()
        cy.get(
          ":nth-child(6) > .grid-section__inner > :nth-child(1) > .flex > :nth-child(2) > .font-semibold"
        )
          .contains("No")
          .click()
        cy.getByID("additionalApplicationSubmissionNotes").type(
          listing["additionalApplicationSubmissionNotes"]
        )

        cy.get(":nth-child(2) > :nth-child(2) > .bg-gray-300 > .button")
          .contains("Add Open House")
          .click()

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
        cy.get("form > .button").contains("Save").click()
      })
    })

    it("publish listing", () => {
      cy.get(
        ".status-aside__buttons > .grid-section > .grid-section__inner > :nth-child(1) > .button"
      )
        .contains("Publish")
        .click()

      cy.get(
        "[data-testid=footer] > .grid-section > .grid-section__inner > :nth-child(1) > .button"
      )
        .contains("Publish")
        .click()
      cy.fixture("listing").then((listing) => {
        cy.get(".page-header__title > .font-semibold").contains(listing["name"])
      })
    })
  })

  describe("edit listing save", () => {
    it("change the listing name", () => {
      cy.get(":nth-child(1) > a > .button").contains("Edit").click()
      cy.getByID("name").type("1")
      cy.get(
        ".status-aside__buttons > .grid-section > .grid-section__inner > :nth-child(1) > .button"
      )
        .contains("Save & Exit")
        .click()
      cy.fixture("listing").then((listing) => {
        cy.get(".page-header__title > .font-semibold").contains(`${listing["name"]}`)
      })
    })
  })

  describe("full new listing save checking validation constraints", () => {
    it("fill listing intro section", () => {
      cy.visit("/")
      cy.get("a > .button").contains("Add Listing").click()
      cy.contains("New Listing")
      cy.fixture("listing").then((listing) => {
        cy.getByID("jurisdiction.id").select(listing["jurisdiciton.id"])
        cy.get("#name").type(listing["name"])
        cy.get("#developer").type(listing["developer"])
      })
    })

    it("fill listing photo section", () => {
      cy.get(":nth-child(2) > .grid-section > .grid-section__inner > .grid-item > .button")
        .contains("Add Photo")
        .click()
      cy.getByID("listing-photo-upload").attachFile("exygy.jpeg", {
        subjectType: "input",
      })
      cy.get('[data-label="File Name"]').contains("exygy")
      cy.get(".p-4 > .is-primary").contains("Save").click()
    })

    it("fill building details section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("buildingAddress.street").type(listing["buildingAddress.street"])
        cy.getByID("neighborhood").type(listing["neighborhood"])
        cy.getByID("buildingAddress.city").type(listing["buildingAddress.city"])
        cy.getByID("buildingAddress.state").select(listing["buildingAddress.state"])
        cy.getByID("buildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
        cy.getByID("yearBuilt").type(listing["yearBuilt"])
        cy.get(".addressPopup").contains(listing["buildingAddress.street"])
      })
    })

    it("fill community type section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("reservedCommunityType.id").select(listing["reservedCommunityType.id"])
        cy.getByID("reservedCommunityDescription").type(listing["reservedCommunityDescription"])
      })
    })

    it("fill listing units section", () => {
      cy.get(
        ":nth-child(8) > :nth-child(2) > .grid-section > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Unit Types")
        .click()
      cy.get(":nth-child(8) > :nth-child(2) > .bg-gray-300 > .button").contains("Add Unit").click()
    })

    it("fill unit: details section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("number").type(listing["number"])
        cy.getByID("unitType.id").select(listing["unitType.id"])
        cy.getByID("numBathrooms").select(listing["numBathrooms"])
        cy.getByID("floor").select(listing["floor"])
        cy.getByID("sqFeet").type(listing["sqFeet"])
        cy.getByID("minOccupancy").select(listing["minOccupancy"])
        cy.getByID("maxOccupancy").select(listing["maxOccupancy"])
      })
    })

    it("fill unit: eligibility section", () => {
      cy.fixture("listing").then((listing) => {
        cy.get(".view-item__value > .flex > :nth-child(1) > .font-semibold")
          .contains("Fixed amount")
          .click()
        cy.getByID("monthlyIncomeMin").type(listing["monthlyIncomeMin"])
        cy.getByID("monthlyRent").type(listing["monthlyRent"])
      })
    })

    it("fill unit: accessibility section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("priorityType.id").select(listing["priorityType.id"])
        cy.get(".mt-6 > .is-primary").contains("Save & Exit").click()
      })
    })

    it("fill preference section", () => {
      cy.get(":nth-child(10) > .grid-section__inner > .bg-gray-300 > .button")
        .contains("Add Preference")
        .click()
      cy.get(".border > .button").contains("Select Preferences").click()
      cy.get(":nth-child(1) > .grid-section__inner > .field > div > .label")
        .contains("Live/Work in County")
        .click()
      cy.get(
        ':nth-child(6) > .fixed-overlay > .fixed-overlay__inner > [data-focus-lock-disabled="false"] > .drawer > .drawer__body > .drawer__content > .button'
      )
        .contains("Save")
        .click()

      cy.get(".drawer__content > .is-primary").contains("Save").click()
    })

    it("fill additional fees section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("applicationFee").type(listing["applicationFee"])
        cy.getByID("depositMin").type(listing["depositMin"])
        cy.getByID("depositMax").type(listing["depositMax"])
        cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
      })
    })

    it("fill building features section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("applicationFee").type(listing["applicationFee"])
        cy.getByID("depositMin").type(listing["depositMin"])
        cy.getByID("depositMax").type(listing["depositMax"])
        cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
      })
    })

    it("fill building features section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("amenities").type(listing["amenities"])
        cy.getByID("accessibility").type(listing["accessibility"])
        cy.getByID("unitAmenities").type(listing["unitAmenities"])
        cy.getByID("smokingPolicy").type(listing["smokingPolicy"])
        cy.getByID("petPolicy").type(listing["petPolicy"])
        cy.getByID("servicesOffered").type(listing["servicesOffered"])
      })
    })

    it("fill additional eligibilty section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("creditHistory").type(listing["creditHistory"])
        cy.getByID("rentalHistory").type(listing["rentalHistory"])
        cy.getByID("criminalBackground").type(listing["criminalBackground"])
        cy.get(":nth-child(18) > .grid-section__inner > .grid-item > .button")
          .contains("Add Building Selection Criteria")
          .click()
        cy.get(".border > :nth-child(1) > .flex > :nth-child(2) > .font-semibold")
          .contains("Webpage URL")
          .click()
        cy.getByID("buildingSelectionCriteriaURL").type(listing["buildingSelectionCriteriaURL"])
        cy.get(".p-4 > .is-primary").contains("Save").click()
      })
    })

    it("fill additional details section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("requiredDocuments").type(listing["requiredDocuments"])
        cy.getByID("programRules").type(listing["programRules"])
        cy.getByID("specialNotes").type(listing["specialNotes"])
      })
    })

    it("progress to application process", () => {
      cy.get(".text-right > .button").contains("Application Process").click()
      cy.verifyAlertBox()
    })

    it("fill rankings & results section", () => {
      cy.get(
        ":nth-child(1) > :nth-child(2) > :nth-child(1) > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("First come first serve")
        .click()
      cy.get(
        ":nth-child(1) > :nth-child(2) > :nth-child(2) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
      cy.get(
        ":nth-child(1) > :nth-child(2) > :nth-child(3) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
    })

    it("fill leasing agent section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
        cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
        cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
        cy.getByID("leasingAgentTitle").type(listing["leasingAgentTitle"])
        cy.getByID("leasingAgentOfficeHours").type(listing["leasingAgentOfficeHours"])
      })
    })

    it("fill application types section", () => {
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(1) > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Yes")
        .click()
      cy.get(
        ":nth-child(1) > .grid-section__inner > :nth-child(2) > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Yes")
        .click()
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(2) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(3) > .grid-section__inner > .grid-item > .flex > :nth-child(2) > .font-semibold"
      )
        .contains("No")
        .click()
    })

    it("fill application address section", () => {
      cy.fixture("listing").then((listing) => {
        cy.getByID("leasingAgentAddress.street").type(listing["leasingAgentAddress.street"])
        cy.getByID("leasingAgentAddress.street2").type(listing["leasingAgentAddress.street2"])
        cy.getByID("leasingAgentAddress.city").type(listing["leasingAgentAddress.city"])
        cy.getByID("leasingAgentAddress.zipCode").type(listing["leasingAgentAddress.zipCode"])
        cy.getByID("leasingAgentAddress.state").select(listing["leasingAgentAddress.state"])

        cy.get(
          ":nth-child(4) > .grid-section__inner > :nth-child(1) > .flex > :nth-child(2) > .font-semibold"
        )
          .contains("No")
          .click()
        cy.get(
          ":nth-child(4) > .grid-section__inner > :nth-child(2) > .flex > :nth-child(2) > .font-semibold"
        )
          .contains("No")
          .click()
        cy.get(
          ":nth-child(6) > .grid-section__inner > :nth-child(1) > .flex > :nth-child(2) > .font-semibold"
        )
          .contains("No")
          .click()
        cy.getByID("additionalApplicationSubmissionNotes").type(
          listing["additionalApplicationSubmissionNotes"]
        )

        cy.get(":nth-child(2) > :nth-child(2) > .bg-gray-300 > .button")
          .contains("Add Open House")
          .click()

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
        cy.get("form > .button").contains("Save").click()
      })
    })

    it("save new listing", () => {
      cy.get(":nth-child(2) > .button").contains("Save as Draft").click()
      cy.get(":nth-child(1) > a > .button").contains("Edit").click()
      cy.get(":nth-child(2) > .button").contains("Publish").click()
      cy.get(
        "[data-testid=footer] > .grid-section > .grid-section__inner > :nth-child(1) > .button"
      )
        .contains("Publish")
        .click()
    })

    it("close out listing", () => {
      cy.get(":nth-child(1) > a > .button").contains("Edit").click()
      cy.get(".is-secondary").contains("Close").click()
      cy.get(
        "[data-testid=footer] > .grid-section > .grid-section__inner > :nth-child(1) > .button"
      )
        .contains("Close")
        .click()
    })
  })
})

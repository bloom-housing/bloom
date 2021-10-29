describe("Listing Management Tests", () => {
  before(() => {
    cy.login()
  })

  it("full listing publish", () => {
    cy.visit("/")
    cy.get("a > .button").contains("Add Listing").click()
    cy.contains("New Listing")
    cy.fixture("listing").then((listing) => {
      cy.getByID("jurisdiction.id").select(listing["jurisdiction.id"])
      cy.get("#name").type(listing["name"])
      cy.get("#developer").type(listing["developer"])
      cy.getByID("addPhotoButton").contains("Add Photo").click()
      cy.getByID("listing-photo-upload").attachFile("exygy.jpeg", {
        subjectType: "input",
      })
      cy.get('[data-label="File Name"]').contains("exygy")
      cy.get(".p-4 > .is-primary").contains("Save").click()
      cy.getByID("buildingAddress.street").type(listing["buildingAddress.street"])
      cy.getByID("neighborhood").type(listing["neighborhood"])
      cy.getByID("buildingAddress.city").type(listing["buildingAddress.city"])
      cy.getByID("buildingAddress.state").select(listing["buildingAddress.state"])
      cy.getByID("buildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
      cy.getByID("yearBuilt").type(listing["yearBuilt"])
      cy.get(".addressPopup").contains(listing["buildingAddress.street"])
      cy.getByID("reservedCommunityType.id").select(listing["reservedCommunityType.id"])
      cy.getByID("reservedCommunityDescription").type(listing["reservedCommunityDescription"])
      cy.get(
        ":nth-child(8) > :nth-child(2) > .grid-section > .grid-section__inner > .grid-item > .flex > :nth-child(1) > .font-semibold"
      )
        .contains("Unit Types")
        .click()
      cy.get(":nth-child(8) > :nth-child(2) > .bg-gray-300 > .button").contains("Add Unit").click()
      cy.getByID("number").type(listing["number"])
      cy.getByID("unitType.id").select(listing["unitType.id"])
      cy.getByID("numBathrooms").select(listing["numBathrooms"])
      cy.getByID("floor").select(listing["floor"])
      cy.getByID("sqFeet").type(listing["sqFeet"])
      cy.getByID("minOccupancy").select(listing["minOccupancy"])
      cy.getByID("maxOccupancy").select(listing["maxOccupancy"])
      cy.get(".view-item__value > .flex > :nth-child(1) > .font-semibold")
        .contains("Fixed amount")
        .click()
      cy.getByID("monthlyIncomeMin").type(listing["monthlyIncomeMin"])
      cy.getByID("monthlyRent").type(listing["monthlyRent"])
      cy.getByID("priorityType.id").select(listing["priorityType.id"])
      cy.get(".mt-6 > .is-primary").contains("Save & Exit").click()
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
      cy.getByID("applicationFee").type(listing["applicationFee"])
      cy.getByID("depositMin").type(listing["depositMin"])
      cy.getByID("depositMax").type(listing["depositMax"])
      cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
      cy.getByID("applicationFee").type(listing["applicationFee"])
      cy.getByID("depositMin").type(listing["depositMin"])
      cy.getByID("depositMax").type(listing["depositMax"])
      cy.getByID("costsNotIncluded").type(listing["costsNotIncluded"])
      cy.getByID("amenities").type(listing["amenities"])
      cy.getByID("accessibility").type(listing["accessibility"])
      cy.getByID("unitAmenities").type(listing["unitAmenities"])
      cy.getByID("smokingPolicy").type(listing["smokingPolicy"])
      cy.getByID("petPolicy").type(listing["petPolicy"])
      cy.getByID("servicesOffered").type(listing["servicesOffered"])
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
      cy.getByID("requiredDocuments").type(listing["requiredDocuments"])
      cy.getByID("programRules").type(listing["programRules"])
      cy.getByID("specialNotes").type(listing["specialNotes"])
      cy.get(".text-right > .button").contains("Application Process").click()
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
      cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
      cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
      cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
      cy.getByID("leasingAgentTitle").type(listing["leasingAgentTitle"])
      cy.getByID("leasingAgentOfficeHours").type(listing["leasingAgentOfficeHours"])
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
      cy.get(".page-header__title > .font-semibold").contains(listing["name"])
    })
  })

  it("verify details page", () => {
    cy.fixture("listing").then((listing) => {
      cy.getByID("jurisdiction.name").contains(listing["jurisdiction.id"])
      cy.get("#name").contains(listing["name"])
      cy.get("#developer").contains(listing["developer"])
      cy.get('[data-label="File Name"]').contains("exygy")
      cy.getByID("buildingAddress.street").contains(listing["buildingAddress.street"])
      cy.get("#neighborhood").contains(listing.neighborhood)
      cy.get("#neighborhood").contains(listing.neighborhood)
      cy.getByID("buildingAddress.city").contains(listing["buildingAddress.city"])
      cy.getByID("buildingAddress.state").contains("CA")
      cy.getByID("buildingAddress.zipCode").contains(listing["buildingAddress.zipCode"])
      cy.get("#yearBuilt").contains(listing["yearBuilt"])
      cy.get("#longitude").contains("-122.400783")
      cy.get("#latitude").contains("37.790057")
      cy.get("#reservedCommunityType").contains(listing["reservedCommunityType.id"])
      cy.get("#reservedCommunityDescription").contains(listing["reservedCommunityDescription"])
      cy.get("#unitTable").contains(listing["number"])
      cy.get("#unitTable").contains(listing["monthlyRent"])
      cy.get("#unitTable").contains(listing["sqFeet"])
      cy.get("#unitTable").contains(listing["priorityType.id"])
      cy.get("#unitTable").contains("Available")
      cy.get("#preferenceTable").contains("1")
      cy.get("#preferenceTable").contains("Live/Work in County")
      cy.get("#preferenceTable").contains("At least one household member lives or works in County")
      cy.get("#applicationFee").contains(listing["applicationFee"])
      cy.get("#applicationFee").contains(listing["applicationFee"])
      cy.get("#applicationFee").contains(listing["applicationFee"])
      cy.get("#depositMin").contains(listing["depositMin"])
      cy.get("#depositMax").contains(listing["depositMax"])
      cy.get("#costsNotIncluded").contains(listing["costsNotIncluded"])
      cy.get("#amenities").contains(listing["amenities"])
      cy.get("#unitAmenities").contains(listing["unitAmenities"])
      cy.get("#accessibility").contains(listing["accessibility"])
      cy.get("#smokingPolicy").contains(listing["smokingPolicy"])
      cy.get("#petPolicy").contains(listing["petPolicy"])
      cy.get("#servicesOffered").contains(listing["servicesOffered"])
      cy.get("#creditHistory").contains(listing["creditHistory"])
      cy.get("#rentalHistory").contains(listing["rentalHistory"])
      cy.get("#criminalBackground").contains(listing["criminalBackground"])
      cy.get("#rentalAssistance").contains(
        "The property is subsidized by the Section 8 Project-Based Voucher Program. As a result, Housing Choice Vouchers, Section 8 and other valid rental assistance programs are not accepted by this property."
      )
      cy.get("#buildingSelectionCriteriaTable").contains(listing["buildingSelectionCriteriaURL"])
      cy.get("#requiredDocuments").contains(listing["requiredDocuments"])
      cy.get("#programRules").contains(listing["programRules"])
      cy.get("#specialNotes").contains(listing["specialNotes"])
      cy.get("#reviewOrderQuestion").contains("First come first serve")
      cy.get("#dueDateQuestion").contains("No")
      cy.getByID("waitlist.openQuestion").contains("No")
      cy.get("#whatToExpect").contains(
        "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."
      )
      cy.get("#leasingAgentName").contains(listing["leasingAgentName"])
      cy.get("#leasingAgentEmail").contains(listing["leasingAgentEmail"].toLowerCase())
      cy.get("#leasingAgentPhone").contains("(520) 245-8811")
      cy.get("#leasingAgentOfficeHours").contains(listing["leasingAgentOfficeHours"])
      cy.get("#leasingAgentTitle").contains(listing["leasingAgentTitle"])
      cy.get("#digitalApplication").contains("Yes")
      cy.getByID("digitalMethod.type").contains("Yes")
      cy.get("#paperApplication").contains("No")
      cy.get("#referralOpportunity").contains("No")
      cy.getByID("leasingAgentAddress.street").contains(listing["leasingAgentAddress.street"])
      cy.getByID("leasingAgentAddress.street2").contains(listing["leasingAgentAddress.street2"])
      cy.getByID("leasingAgentAddress.city").contains(listing["leasingAgentAddress.city"])
      cy.getByID("leasingAgentAddress.state").contains("CA")
      cy.getByID("leasingAgentAddress.zipCode").contains(listing["leasingAgentAddress.zipCode"])
      cy.get("#applicationPickupQuestion").contains("No")
      cy.get("#applicationMailingAddress").contains("No")
      cy.get("#applicationDropOffQuestion").contains("No")
      cy.get("#postmarksConsideredQuestion").contains("No")
      cy.get("#additionalApplicationSubmissionNotes").contains(
        listing["additionalApplicationSubmissionNotes"]
      )
      cy.getByID("openhouseHeader").contains("10/04/2022")
      cy.getByID("openhouseHeader").contains("10:04:00 AM")
      cy.getByID("openhouseHeader").contains("11:05:00 PM")
    })
  })
})

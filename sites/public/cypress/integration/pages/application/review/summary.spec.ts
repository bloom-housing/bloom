// describe("applications/review/summary", function () {
//   const route = "/applications/review/summary"

//   beforeEach(() => {
//     cy.fixture("applications/summary.json").as("data")
//   })

//   it("Should render 'You' section and check values", function () {
//     cy.loadConfig({}, "applicationConfigFilled.json")
//     cy.visit(route)

//     cy.getByID("applicantName").should("include.text", this.data.you.name)
//     cy.getByID("applicantbirthDay").should("include.text", this.data.you.dateOfBirth)

//     cy.getByID("applicantPhone").should("include.text", this.data.you.workPhone)
//     cy.getByID("applicantPhone").should("include.text", this.data.you.workPhoneLabel)

//     cy.getByID("applicantPhone").should("include.text", this.data.you.workPhone)
//     cy.getByID("applicantPhone").should("include.text", this.data.you.workPhoneLabel)

//     cy.getByID("applicantAdditionalPhone").should("include.text", this.data.you.homePhone)
//     cy.getByID("applicantAdditionalPhone").should("include.text", this.data.you.homePhoneLabel)

//     cy.getByID("applicantEmail").should("include.text", this.data.you.email)

//     cy.getByID("applicantAddress").should("include.text", this.data.you.address.street)
//     cy.getByID("applicantAddress").should("include.text", this.data.you.address.unit)
//     cy.getByID("applicantAddress").should("include.text", this.data.you.address.city_line)

//     cy.getByID("applicantMailingAddress").should(
//       "include.text",
//       this.data.you.mailingAddress.street
//     )
//     cy.getByID("applicantMailingAddress").should("include.text", this.data.you.mailingAddress.unit)
//     cy.getByID("applicantMailingAddress").should(
//       "include.text",
//       this.data.you.mailingAddress.city_line
//     )

//     cy.getByID("applicantWorkAddress").should("include.text", this.data.you.workAddress.street)
//     cy.getByID("applicantWorkAddress").should("include.text", this.data.you.workAddress.unit)
//     cy.getByID("applicantWorkAddress").should("include.text", this.data.you.workAddress.city_line)

//     cy.getByID("applicantPreferredContactType").should(
//       "include.text",
//       this.data.you.preferredContactType
//     )
//   })

//   it("Should not render 'Alternate Contact' section when type is empty", function () {
//     cy.loadConfig(
//       {
//         "alternateContact.type": "",
//       },
//       "applicationConfigFilled.json"
//     )
//     cy.visit(route)

//     cy.getByID("alternateContact").should("not.be.visible")
//   })

//   it("Should not render 'Alternate Contact' section when type is noContact", function () {
//     cy.loadConfig(
//       {
//         "alternateContact.type": "noContact",
//       },
//       "applicationConfigFilled.json"
//     )
//     cy.visit(route)

//     cy.getByID("alternateContact").should("not.be.visible")
//   })

//   it("Should render 'Alternate Contact' section and display values", function () {
//     cy.loadConfig({}, "applicationConfigFilled.json")
//     cy.visit(route)

//     cy.getByID("alternateName").should("include.text", this.data.alternateContact.name)
//     cy.getByID("alternateName").should("include.text", this.data.alternateContact.agency)

//     cy.getByID("alternateEmail").should("include.text", this.data.alternateContact.email)

//     cy.getByID("alternatePhone").should("include.text", this.data.alternateContact.phone)

//     cy.getByID("alternateMailingAddress").should(
//       "include.text",
//       this.data.alternateContact.address.street
//     )
//     cy.getByID("alternateMailingAddress").should(
//       "include.text",
//       this.data.alternateContact.address.city_line
//     )
//   })

//   it("Should not render 'Household Members' section when householdSize is <= 1", function () {
//     cy.loadConfig(
//       {
//         householdSize: 1,
//       },
//       "applicationConfigFilled.json"
//     )
//     cy.visit(route)

//     cy.getByID("householdMembers").should("not.be.visible")
//   })

//   it("Should render 'Household Members' section and display values", function () {
//     cy.loadConfig({}, "applicationConfigFilled.json")
//     cy.visit(route)

//     cy.getByID("members").should("include.text", this.data.householdMembers.name)
//     cy.getByID("members").should("include.text", this.data.householdMembers.birth)
//     cy.getByID("members").should("include.text", this.data.householdMembers.address.street)
//     cy.getByID("members").should("include.text", this.data.householdMembers.address.unit)
//     cy.getByID("members").should("include.text", this.data.householdMembers.address.city_line)
//   })

//   it("Should render 'Household Details' section and display values", function () {
//     cy.loadConfig({}, "applicationConfigFilled.json")
//     cy.visit(route)

//     cy.getByID("householdUnitType").should(
//       "include.text",
//       this.data.householdDetails.preferredUnitType
//     )
//     cy.getByID("householdAda").should("include.text", this.data.householdDetails.ada)
//   })

//   it("Should render 'Income' section and display values", function () {
//     cy.loadConfig({}, "applicationConfigFilled.json")
//     cy.visit(route)

//     cy.getByID("incomeVouchers").should("include.text", this.data.income.vouchers)
//     cy.getByID("incomeValue").should("include.text", this.data.income.incomeValue)
//   })

//   it("Should render 'Preferences' section and display values", function () {
//     cy.loadConfig({}, "applicationConfigFilled.json")
//     cy.visit(route)

//     cy.getByID("preferences").should("include.text", this.data.prefences.region)
//     cy.getByID("preferences").should("include.text", this.data.prefences.work)
//   })

//   it("Should move to the next step after 'Confirm' button click", function () {
//     cy.get("button").contains("Confirm").click()
//     cy.isNextRouteValid("summary")
//   })
// })

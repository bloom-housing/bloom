// describe("applications/contact/alternate-contact-contact", function () {
//   const route = "/applications/contact/alternate-contact-contact"
//   beforeEach(() => {
//     cy.loadConfig()
//     cy.fixture("applications/alternate-contact-contact.json").as("data")
//     cy.visit(route)
//   })

//   it("Should render form", function () {
//     cy.get("form").should("be.visible")
//     cy.location("pathname").should("include", route)
//   })

//   it("Should display initial form errors", function () {
//     cy.goNext()

//     cy.checkErrorAlert("be.visible")

//     // check phone number only
//     cy.getByID("phoneNumber-error").should("be.visible").and("not.to.be.empty")
//   })

//   it("Should save form values and redirect to the next step", function () {
//     cy.getByID("phoneNumber").type(this.data["phoneNumber"])
//     cy.getByID("emailAddress").type(this.data["emailAddress"])
//     cy.getByID("mailingAddress.street").type(this.data["mailingAddress.street"])
//     cy.getByID("mailingAddress.city").type(this.data["mailingAddress.city"])
//     cy.getByID("mailingAddress.state").select(this.data["mailingAddress.state"])
//     cy.getByID("mailingAddress.zipCode").type(this.data["mailingAddress.zipCode"])

//     cy.goNext()

//     // no errors should be visible
//     cy.checkErrorAlert("not.exist")
//     cy.checkErrorMessages("not.exist")

//     // check next route
//     cy.isNextRouteValid("alternateContactInfo")

//     // check context values
//     cy.getSubmissionContext()
//       .its("alternateContact")
//       .should("deep.nested.include", {
//         phoneNumber: this.data["phoneNumberFormatted"],
//         emailAddress: this.data["emailAddress"],
//         mailingAddress: {
//           street: this.data["mailingAddress.street"],
//           state: this.data["mailingAddress.state"],
//           zipCode: this.data["mailingAddress.zipCode"],
//           city: this.data["mailingAddress.city"],
//         },
//       })
//   })
// })

// describe("applications/household/ada", function () {
//   const route = "/applications/household/ada"

//   beforeEach(() => {
//     cy.loadConfig()
//     cy.fixture("applications/ada.json").as("data")
//     cy.visit(route)
//   })

//   it("Should render form", function () {
//     cy.get("form").should("be.visible")
//     cy.location("pathname").should("include", route)
//   })

//   it("Should display initial form errors", function () {
//     cy.goNext()

//     cy.checkErrorAlert("be.visible")

//     cy.getByID("accessibilityCheckboxGroupError").should("be.visible").and("not.to.be.empty")
//   })

//   it("Should uncheck all checkboxes when 'No' is selected", function () {
//     cy.getByID("mobility").check()
//     cy.getByID("vision").check()
//     cy.getByID("hearing").check()

//     cy.getByID("none").check()

//     cy.getByID("mobility").should("not.be.checked")
//     cy.getByID("vision").should("not.be.checked")
//     cy.getByID("hearing").should("not.be.checked")
//   })

//   it("Should save form values and redirect to the next step", function () {
//     cy.getByID("mobility").check()
//     cy.getByID("vision").check()
//     cy.getByID("hearing").check()

//     cy.goNext()

//     cy.checkErrorAlert("not.exist")
//     cy.checkErrorMessages("not.exist")

//     cy.isNextRouteValid("adaHouseholdMembers")

//     cy.getSubmissionContext().its("accessibility").should("deep.nested.include", {
//       mobility: this.data["mobility"],
//       vision: this.data["vision"],
//       hearing: this.data["hearing"],
//     })
//   })
// })

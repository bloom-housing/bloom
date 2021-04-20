// describe("applications/review/demographics", function () {
//   const route = "/applications/review/demographics"

//   beforeEach(() => {
//     cy.loadConfig()
//     cy.fixture("applications/demographics.json").as("data")
//     cy.visit(route)
//   })

//   it("Should render form", function () {
//     cy.get("form").should("be.visible")
//     cy.location("pathname").should("include", route)
//   })

//   it("Should save form values and redirect to the next step", function () {
//     cy.getByID("ethnicity").select(this.data["ethnicity"])
//     cy.getByID("gender").select(this.data["gender"])
//     cy.getByID("sexualOrientation").select(this.data["sexualOrientation"])
//     cy.getByID("alamedaCountyHCDWebsite").check()
//     cy.getByID("developerWebsite").check()

//     cy.goNext()

//     cy.checkErrorAlert("not.exist")
//     cy.checkErrorMessages("not.exist")

//     cy.isNextRouteValid("demographics")

//     cy.getSubmissionContext().its("demographics").should("deep.nested.include", {
//       ethnicity: this.data["ethnicity"],
//       gender: this.data["gender"],
//       sexualOrientation: this.data["sexualOrientation"],
//       howDidYouHear: this.data["howDidYouHear"],
//     })
//   })
// })

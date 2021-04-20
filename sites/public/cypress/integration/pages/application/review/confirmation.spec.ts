// describe("applications/review/confirmation", function () {
//   const route = "/applications/review/confirmation"

//   beforeEach(() => {
//     cy.loadConfig(
//       {
//         confirmationId: "123",
//       },
//       "applicationConfigFilled.json"
//     )
//     cy.visit(route)
//   })

//   it("Should show confirmationID", function () {
//     cy.getByID("confirmationId").should("include.text", "123")
//   })

//   it("Should redirect to create account page", function () {
//     cy.get("button").contains("Create Account").click()
//     cy.location("pathname").should("include", "/create-account")
//   })

//   it("Should redirect to create account page", function () {
//     cy.get("a").contains("I'm done").click()
//     cy.location("pathname").should("equals", "/")
//   })

//   it("Should redirect to create account page", function () {
//     cy.get("a").contains("Browse more listings").click()
//     cy.location("pathname").should("equals", "/listings")
//   })

//   it("Should redirect to application view", function () {
//     cy.get("a").contains("View submitted application").click()
//     cy.location("pathname").should("equals", "/applications/view")
//   })
// })

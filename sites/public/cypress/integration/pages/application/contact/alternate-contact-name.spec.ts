import { filledApplication } from "../../../../mockData/applicationData"

describe("applications/contact/alternate-contact-name", function () {
  const route = "/applications/contact/alternate-contact-name"

  it("should render the alternate contact name sub-form", function () {
    cy.visit(route)
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.visit(route)
    cy.goNext()
    cy.location("pathname").should("include", route)
    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

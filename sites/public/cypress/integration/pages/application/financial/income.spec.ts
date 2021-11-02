import { filledApplication } from "../../../../mockData/applicationData"

describe("applications/financial/income", function () {
  const route = "applications/financial/income"

  beforeEach(() => {
    cy.visit(route)
  })
  it("should render the income sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()
    cy.location("pathname").should("include", route)
    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })
})

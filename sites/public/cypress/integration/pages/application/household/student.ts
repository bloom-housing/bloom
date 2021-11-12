describe("applications/household/student", function () {
  const route = "/applications/household/student"

  beforeEach(() => {
    cy.loadConfig()
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("householdStudent-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.getByID("householdStudentYes").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("householdStudent")

    cy.getSubmissionContext().should("include", {
      householdStudent: true,
    })
  })
})

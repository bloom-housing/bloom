describe("applications/preferences/select", function () {
  const route = "/applications/preferences/select"

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

    cy.getByID("preferences-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should uncheck other checkboxes when 'none' is selected", function () {
    cy.getByID("liveIn").check()
    cy.getByID("workIn").check()

    cy.getByID("none").check()

    cy.getByID("liveIn").should("not.be.checked")
    cy.getByID("workIn").should("not.be.checked")
  })

  it("Should save form values and redirect to /preferences/general", function () {
    cy.getByID("none").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferencesIntroduction")

    cy.getSubmissionContext().its("preferences").should("include", {
      liveIn: false,
      workIn: false,
      none: true,
    })
  })

  it("Should save form values, skip /preferences/general and move to the next step", function () {
    cy.getByID("liveIn").check()
    cy.getByID("workIn").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferencesIntroduction", 1)

    cy.getSubmissionContext().its("preferences").should("include", {
      liveIn: true,
      workIn: true,
      none: false,
    })
  })
})

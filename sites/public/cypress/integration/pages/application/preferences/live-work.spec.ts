describe("applications/preferences/live-work", function () {
  const route = "/applications/preferences/live-work"

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
    cy.getByID("live").check()
    cy.getByID("work").check()

    cy.getByID("none").check()

    cy.getByID("live").should("not.be.checked")
    cy.getByID("work").should("not.be.checked")
  })

  it("Should save unclaimed preference and move to the next step", function () {
    cy.getByID("none").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferencesLiveWork")

    cy.getSubmissionContext()
      .its("preferences")
      .its(0)
      .should("deep.equal", {
        key: "liveWork",
        claimed: false,
        options: [
          {
            key: "live",
            checked: false,
          },
          {
            key: "work",
            checked: false,
          },
        ],
      })
  })

  it("Should save claimed preference and move to the next step", function () {
    cy.getByID("live").check()
    cy.getByID("work").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("preferencesLiveWork")

    cy.getSubmissionContext()
      .its("preferences")
      .its(0)
      .should("deep.equal", {
        key: "liveWork",
        claimed: true,
        options: [
          {
            key: "live",
            checked: true,
          },
          {
            key: "work",
            checked: true,
          },
        ],
      })
  })
})

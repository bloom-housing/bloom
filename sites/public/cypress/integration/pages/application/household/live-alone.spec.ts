describe("applications/household/live-alone", function () {
  const route = "/applications/household/live-alone"

  it("Should render form", function () {
    cy.loadConfig()
    cy.visit(route)

    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should move to preferred-units and save members value", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 0,
      },
    })
    cy.visit(route)

    cy.getByID("btn-live-alone").click()
    cy.location("pathname").should("include", "applications/household/preferred-units")

    cy.getSubmissionContext().should("deep.nested.include", {
      householdSize: 1,
      householdMembers: [],
    })
  })

  // TODO: toggle this verification off at the jurisdiction level with a feature flag
  // it("Should show an error when min. household size is > 1", function () {
  //   cy.loadConfig({
  //     property: {
  //       householdSizeMax: 2,
  //       householdSizeMin: 1,
  //     },
  //   })
  //   cy.visit(route)

  //   cy.getByID("btn-live-alone").click()

  //   cy.get(".alert-notice").should("be.visible").and("contain", "small")
  // })

  // TODO: should be implemented, but first frontend have to be fixed
  // it("Should show an error when max. household size is 1", function () {
  //   cy.loadConfig(
  //     {
  //       property: {
  //         householdSizeMax: 1,
  //         householdSizeMin: 0,
  //       },
  //     },
  //     "applicationConfigFilled.json"
  //   )
  //   cy.visit(route)

  //   cy.getByID("btn-with-people").click()

  //   cy.get(".alert-notice").should("be.visible").and("contain", "too big")
  // })

  it("Should move to members-info and save members value", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 0,
      },
    })
    cy.visit(route)

    cy.getByID("btn-with-people").click()
    cy.location("pathname").should("include", "applications/household/members-info")

    cy.getSubmissionContext().should("deep.nested.include", {
      householdSize: 0,
    })
  })
})

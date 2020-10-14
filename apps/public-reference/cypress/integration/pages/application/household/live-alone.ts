describe("applications/household/live-alone", function () {
  beforeEach(() => {
    cy.loadConfig()
    cy.visit("/applications/household/live-alone")
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/household/live-alone")
  })

  it("Should move to preferred-units and save members value", function () {
    cy.getByID("btn-live-alone").click()
    cy.location("pathname").should("include", "applications/household/preferred-units")

    cy.getSubmissionContext().should("deep.nested.include", {
      householdSize: 1,
      householdMembers: [],
    })
  })

  it("Should move to members-info and save members value", function () {
    cy.getByID("btn-with-people").click()
    cy.location("pathname").should("include", "applications/household/members-info")

    cy.getSubmissionContext().should("deep.nested.include", {
      householdSize: 0,
    })
  })
})

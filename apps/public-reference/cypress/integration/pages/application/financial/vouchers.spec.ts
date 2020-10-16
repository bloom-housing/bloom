describe("applications/financial/vouchers", function () {
  beforeEach(() => {
    cy.loadConfig()
    cy.visit("/applications/financial/vouchers")
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "applications/financial/vouchers")
  })

  it("Should display initial form errors", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("incomeVouchers-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.getByID("incomeVouchersYes").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("vouchersSubsidies")

    cy.getSubmissionContext().should("include", {
      incomeVouchers: true,
    })
  })
})

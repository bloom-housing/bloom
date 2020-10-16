describe("applications/financial/income", function () {
  const route = "applications/financial/income"

  beforeEach(() => {
    cy.fixture("applications/income.json").as("data")
  })

  it("Should render form", function () {
    cy.loadConfig()
    cy.visit(route)

    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    cy.loadConfig()
    cy.visit(route)

    cy.goNext()

    cy.checkErrorAlert("be.visible")

    cy.getByID("income-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("incomePeriod-error").should("be.visible").and("not.to.be.empty")
  })

  it("should display error when income is lower than allowed", function () {
    cy.loadConfig()
    cy.visit(route)

    cy.getByID("income").type(this.data["incomeLower"])
    cy.getByID("incomePeriodMonthly").check()

    cy.goNext()

    cy.get(".alert").should("be.visible").and("contain.text", this.data["incomeTooLowErrorText"])
  })

  it("should display error when income is higher than allowed", function () {
    cy.loadConfig()
    cy.visit(route)

    cy.getByID("income").type(this.data["incomeHigher"])
    cy.getByID("incomePeriodMonthly").check()

    cy.goNext()

    cy.get(".alert").should("be.visible").and("contain.text", this.data["incomeTooHighErrorText"])
  })

  it("Should do not check income when user selected voucher in the previous step", function () {
    cy.loadConfig({
      incomeVouchers: true,
    })
    cy.visit(route)

    cy.getByID("income").type(this.data["incomeLower"])
    cy.getByID("incomePeriodMonthly").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("income")
  })

  it("Should save form values and redirect to the next step", function () {
    cy.loadConfig()
    cy.visit(route)

    cy.getByID("income").type(this.data["income"])
    cy.getByID("incomePeriodMonthly").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("income")

    cy.getSubmissionContext().should("include", {
      income: this.data["income"],
      incomePeriod: this.data["incomePeriod"],
    })
  })
})

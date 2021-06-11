import { getListingIncome } from "../../../../support/helpers"

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

  it("Should do not check income when user selected voucher in the previous step", function () {
    cy.loadConfig({}, "applicationConfigBlank.json", {
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

  // TODO: toggle this verification off at the jurisdiction level with a feature flag
  // it("Should show error when annual income is lower than allowed", function () {
  //   cy.loadConfig()
  //   cy.visit(route)

  //   const income = getListingIncome()

  //   const annualMin = income?.annualMax ? income?.annualMin - 1 : null

  //   cy.getByID("income").type(`${annualMin}`)
  //   cy.getByID("incomePeriodYearly").check()

  //   cy.goNext()

  //   cy.checkErrorAlert("be.visible")
  //   cy.get(".alert").should("be.visible").and("contain.text", this.data["incomeTooLowErrorText"])
  // })

  // it("Should show error when annual income is more than allowed", function () {
  //   cy.loadConfig()
  //   cy.visit(route)

  //   const income = getListingIncome()

  //   const annualMax = income?.annualMax ? income?.annualMax + 1 : null

  //   cy.getByID("income").type(`${annualMax}`)
  //   cy.getByID("incomePeriodYearly").check()

  //   cy.goNext()

  //   cy.checkErrorAlert("be.visible")
  //   cy.get(".alert").should("be.visible").and("contain.text", this.data["incomeTooHighErrorText"])
  // })

  // it("Should show error when monthly income is less than allowed", function () {
  //   cy.loadConfig()
  //   cy.visit(route)

  //   const income = getListingIncome()

  //   const monthlyMin = income?.monthlyMin ? income?.monthlyMin - 1 : null

  //   cy.getByID("income").type(`${monthlyMin}`)
  //   cy.getByID("incomePeriodMonthly").check()

  //   cy.goNext()

  //   cy.checkErrorAlert("be.visible")
  //   cy.get(".alert").should("be.visible").and("contain.text", this.data["incomeTooLowErrorText"])
  // })

  // it("Should show error when monthly income is more than allowed", function () {
  //   cy.loadConfig()
  //   cy.visit(route)

  //   const income = getListingIncome()

  //   const monthlyMax = income?.monthlyMax ? income?.monthlyMax + 1 : null

  //   cy.getByID("income").type(`${monthlyMax}`)
  //   cy.getByID("incomePeriodMonthly").check()

  //   cy.goNext()

  //   cy.checkErrorAlert("be.visible")
  //   cy.get(".alert").should("be.visible").and("contain.text", this.data["incomeTooHighErrorText"])
  // })

  it("Should save form values and redirect to the next step", function () {
    cy.loadConfig()
    cy.visit(route)

    const income = getListingIncome()
    const incomeMonthlyAllowed = income?.monthlyMax ? income?.monthlyMax - 1 : null

    cy.getByID("income").type(`${incomeMonthlyAllowed}.00`)
    cy.getByID("incomePeriodMonthly").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.isNextRouteValid("income")

    cy.getSubmissionContext().should("include", {
      income: `${incomeMonthlyAllowed}.00`,
      incomePeriod: this.data["incomePeriod"],
    })
  })
})

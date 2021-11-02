import { coliseumApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.beginApplication("Test: Coliseum")
    cy.step1PrimaryApplicantName(coliseumApplication)
    cy.step2PrimaryApplicantAddresses(coliseumApplication)
    cy.step3AlternateContactType(coliseumApplication)
    cy.step4AlternateContactName(coliseumApplication)
    cy.step5AlternateContactInfo(coliseumApplication)
    cy.step6HouseholdSize(coliseumApplication)
    cy.step7HouseholdMembersList()
    cy.step9PreferredUnits(coliseumApplication)
    cy.step10Accessibility(coliseumApplication)
    cy.step11IncomeVouchers(coliseumApplication)
    cy.step12Income(coliseumApplication)
    cy.step13SelectPreferences(coliseumApplication)
    cy.step15Demographics(coliseumApplication)
    cy.step16Summary(coliseumApplication)
    // Check values on summary
    // Go back and edit sections
    cy.step17TermsAndSubmit(coliseumApplication)
  })
})

import { coliseumApplication, minimalDataApplication } from "../../mockData/applicationData"

describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.beginApplication("Test: Coliseum")
    cy.step1PrimaryApplicantName(coliseumApplication)
    cy.step2PrimaryApplicantAddresses(coliseumApplication)
    cy.step3AlternateContactType(coliseumApplication)
    cy.step4AlternateContactName(coliseumApplication)
    cy.step5AlternateContactInfo(coliseumApplication)
    cy.step6HouseholdSize(coliseumApplication)
    cy.step7AddHouseholdMembers(coliseumApplication)
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
  it("should submit a minimal application for the Test: Default, No Preferences", function () {
    cy.beginApplicationRejectAutofill("Test: Default, No Preferences")
    cy.step1PrimaryApplicantName(minimalDataApplication)
    cy.step2PrimaryApplicantAddresses(minimalDataApplication)
    cy.step3AlternateContactType(minimalDataApplication)
    cy.step6HouseholdSize(minimalDataApplication)
    cy.step9PreferredUnits(minimalDataApplication)
    cy.step10Accessibility(minimalDataApplication)
    cy.step11IncomeVouchers(minimalDataApplication)
    cy.step12Income(minimalDataApplication)
    cy.step14GeneralPool()
    cy.step15Demographics(minimalDataApplication)
    cy.step16Summary(minimalDataApplication)
    // Check values on summary
    // Go back and edit sections
    cy.step17TermsAndSubmit(coliseumApplication)
  })
})

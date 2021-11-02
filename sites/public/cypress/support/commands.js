/* eslint-disable no-undef */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { applicationStepOrder, filledApplication } from "./../mockData/applicationData"

Cypress.Commands.add("signIn", () => {
  cy.get(`[data-test-id="sign-in-email-field"]`).type("admin@example.com")
  cy.get(`[data-test-id="sign-in-password-field"]`).type("abcdef")
  cy.get(`[data-test-id="sign-in-button"]`).click()
})

Cypress.Commands.add("goNext", () => {
  return cy.get(`[data-test-id="app-next-step-button"]`).click()
})

Cypress.Commands.add("goToReview", () => {
  return cy.get("button").contains("Save and return to review").click()
})

Cypress.Commands.add("getSessionStorageApplication", () => {
  return sessionStorage.getItem("bloom-app-autosave")
})

Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-test-id="${testId}"]`)
})

Cypress.Commands.add("getPhoneFieldByTestId", (testId) => {
  return cy.get(`[data-test-id="${testId}"]`).find("input")
})

Cypress.Commands.add("checkErrorAlert", (command) => {
  cy.get(`[data-test-id="alert-box"]`).should(command)
})

Cypress.Commands.add("checkErrorMessages", (command) => {
  cy.get(`[data-test-id="error-message"]`).should(command)
})

Cypress.Commands.add("beginApplication", (listingName) => {
  cy.visit("/listings")
  cy.contains(listingName).click()
  cy.getByTestId("listing-view-apply-button").eq(1).click()
  cy.getByTestId("app-choose-language-sign-in-button").click()
  cy.get("[data-test-id=sign-in-email-field]").type("admin@example.com")
  cy.get("[data-test-id=sign-in-password-field]").type("abcdef")
  cy.get("[data-test-id=sign-in-button").click()
  cy.getByTestId("app-choose-language-button").eq(0).click()
  cy.getByTestId("app-next-step-button").click()
})

// primaryApplicantName
Cypress.Commands.add("step1", () => {
  cy.getByTestId("app-primary-first-name").type(filledApplication.applicant.firstName)
  cy.getByTestId("app-primary-middle-name").type(filledApplication.applicant.middleName)
  cy.getByTestId("app-primary-last-name").type(filledApplication.applicant.lastName)
  cy.getByTestId("dob-field-month").type(filledApplication.applicant.birthMonth)
  cy.getByTestId("dob-field-day").type(filledApplication.applicant.birthDay)
  cy.getByTestId("dob-field-year").type(filledApplication.applicant.birthYear)
  cy.getByTestId("app-primary-email").type(filledApplication.applicant.emailAddress)
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("primaryApplicantName")
})

// primaryApplicantAddress
Cypress.Commands.add("step2", () => {
  // Primary applicant phone
  cy.getPhoneFieldByTestId("app-primary-phone-number").type(filledApplication.applicant.phoneNumber)
  cy.getByTestId("app-primary-phone-number-type").select(
    filledApplication.applicant.phoneNumberType
  )
  cy.getByTestId("app-primary-additional-phone").check()
  cy.getPhoneFieldByTestId("app-primary-additional-phone-number").type(
    filledApplication.additionalPhoneNumber
  )
  cy.getByTestId("app-primary-additional-phone-number-type").select(
    filledApplication.additionalPhoneNumberType
  )
  // Primary applicant address
  cy.getByTestId("app-primary-address-street").type(filledApplication.applicant.address.street)
  cy.getByTestId("app-primary-address-street2").type(filledApplication.applicant.address.street2)
  cy.getByTestId("app-primary-address-city").type(filledApplication.applicant.address.city)
  cy.getByTestId("app-primary-address-state").select(filledApplication.applicant.address.state)
  cy.getByTestId("app-primary-address-zip").type(filledApplication.applicant.address.zipCode)

  // Primary applicant mailing address
  cy.getByTestId("app-primary-send-to-mailing").check()
  cy.getByTestId("app-primary-mailing-address-street").type(
    filledApplication.mailingAddress.street2
  )
  cy.getByTestId("app-primary-mailing-address-street2").type(
    filledApplication.mailingAddress.street2
  )
  cy.getByTestId("app-primary-mailing-address-city").type(filledApplication.mailingAddress.city)
  cy.getByTestId("app-primary-mailing-address-state").select(filledApplication.mailingAddress.state)
  cy.getByTestId("app-primary-mailing-address-zip").type(filledApplication.mailingAddress.zipCode)

  cy.getByTestId("app-primary-contact-preference").eq(0).check()

  // Primary applicant work address
  cy.getByTestId("app-primary-work-in-region-yes").check()
  cy.getByTestId("app-primary-work-address-street").type(
    filledApplication.applicant.workAddress.street
  )
  cy.getByTestId("app-primary-work-address-street2").type(
    filledApplication.applicant.workAddress.street2
  )
  cy.getByTestId("app-primary-work-address-city").type(filledApplication.applicant.workAddress.city)
  cy.getByTestId("app-primary-work-address-state").select(
    filledApplication.applicant.workAddress.state
  )
  cy.getByTestId("app-primary-work-address-zip").type(
    filledApplication.applicant.workAddress.zipCode
  )

  // Submit values
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("primaryApplicantAddress")
})

// alternateContactType
Cypress.Commands.add("step3", () => {
  cy.getByTestId("app-alternate-type").eq(3).check()
  cy.get("[data-test-id=app-alternate-other-type]").type(
    filledApplication.alternateContact.otherType
  )
  cy.goNext()

  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactType")
})

// alternateContactName
Cypress.Commands.add("step4", () => {
  cy.getByTestId("app-alternate-first-name").type(filledApplication.alternateContact.firstName)
  cy.getByTestId("app-alternate-last-name").type(filledApplication.alternateContact.lastName)
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactName")
})

// alternateContactInfo
Cypress.Commands.add("step5", () => {
  cy.getPhoneFieldByTestId("app-alternate-phone-number").type(
    filledApplication.alternateContact.phoneNumber
  )
  cy.getByTestId("app-alternate-email").type(filledApplication.alternateContact.emailAddress)
  cy.getByTestId("app-alternate-mailing-address-street").type(
    filledApplication.alternateContact.mailingAddress.street
  )
  cy.getByTestId("app-alternate-mailing-address-city").type(
    filledApplication.alternateContact.mailingAddress.city
  )
  cy.getByTestId("app-alternate-mailing-address-state").select(
    filledApplication.alternateContact.mailingAddress.state
  )
  cy.getByTestId("app-alternate-mailing-address-zip").type(
    filledApplication.alternateContact.mailingAddress.zipCode
  )

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactInfo")
})

// TODO does live alone --> preferred units
Cypress.Commands.add("step6Members", () => {
  cy.getByTestId("app-household-live-with-others").click()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/household/members-info")
})

Cypress.Commands.add("step6Alone", () => {
  cy.getByTestId("app-household-live-alone").click()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/household/preferred-units")
  cy.isNextRouteValid("liveAlone")
})

Cypress.Commands.add("step7", () => {
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/household/add-members")
  cy.isNextRouteValid("householdMemberInfo")
})

Cypress.Commands.add("step8", () => {
  cy.getByTestId("app-add-household-member-button").click()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/household/member")

  cy.getByTestId("app-household-member-first-name").type(
    filledApplication.householdMembers[0].firstName
  )
  cy.getByTestId("app-household-member-middle-name").type(
    filledApplication.householdMembers[0].middleName
  )
  cy.getByTestId("app-household-member-last-name").type(
    filledApplication.householdMembers[0].lastName
  )
  cy.getByTestId("dob-field-month").type(filledApplication.householdMembers[0].birthMonth)
  cy.getByTestId("dob-field-day").type(filledApplication.householdMembers[0].birthDay)
  cy.getByTestId("dob-field-year").type(filledApplication.householdMembers[0].birthYear)
  cy.getByTestId("app-household-member-relationship").select(
    filledApplication.householdMembers[0].relationship
  )

  cy.getByTestId("app-household-member-same-address").eq(1).check()
  cy.getByTestId("app-household-member-address-street").type(
    filledApplication.householdMembers[0].address.street
  )
  cy.getByTestId("app-household-member-address-street2").type(
    filledApplication.householdMembers[0].address.street2
  )
  cy.getByTestId("app-household-member-address-city").type(
    filledApplication.householdMembers[0].address.city
  )
  cy.getByTestId("app-household-member-address-state").select(
    filledApplication.householdMembers[0].address.state
  )
  cy.getByTestId("app-household-member-address-zip").type(
    filledApplication.householdMembers[0].address.zipCode
  )

  // fill region details
  cy.getByTestId("app-household-member-work-in-region").eq(0).check()
  cy.getByTestId("app-household-member-work-address-street").type(
    filledApplication.householdMembers[0].workAddress.street
  )
  cy.getByTestId("app-household-member-work-address-street2").type(
    filledApplication.householdMembers[0].workAddress.street2
  )
  cy.getByTestId("app-household-member-work-address-city").type(
    filledApplication.householdMembers[0].workAddress.city
  )
  cy.getByTestId("app-household-member-work-address-state").select(
    filledApplication.householdMembers[0].workAddress.state
  )
  cy.getByTestId("app-household-member-work-address-zip").type(
    filledApplication.householdMembers[0].workAddress.zipCode
  )
  cy.getByTestId("app-household-member-save").click()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "/applications/household/add-members")
  cy.getByTestId("app-done-household-members-button").click()
})

Cypress.Commands.add("step9", () => {
  cy.getByTestId("app-preferred-units").eq(0).check()
  cy.getByTestId("app-preferred-units").eq(1).check()
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("preferredUnitSize")
})

Cypress.Commands.add("step10", () => {
  cy.getByTestId("app-ada-mobility").check()
  cy.getByTestId("app-ada-vision").check()
  cy.getByTestId("app-ada-hearing").check()

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("adaHouseholdMembers")
})

Cypress.Commands.add("step11", () => {
  cy.getByTestId("app-income-vouchers").eq(0).check()
  cy.goNext()

  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("vouchersSubsidies")
})

Cypress.Commands.add("step12", () => {
  cy.getByTestId("app-income").type(filledApplication.income)
  cy.getByTestId("app-income-period").eq(1).check()

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("income")
})

Cypress.Commands.add("step13SelectPreferences", () => {
  cy.getByTestId("app-preference-option").eq(0).check()
  cy.getByTestId("app-preference-option").eq(1).check()
  cy.goNext()
  cy.getByTestId("app-preference-option").eq(0).check()
  cy.goNext()
  cy.getByTestId("app-preference-option").eq(0).check()
  cy.goNext()
  // Skip general step
  cy.isNextRouteValid("preferencesAll", 1)
})

Cypress.Commands.add("step13NoPreferences", () => {
  cy.getByTestId("app-preference-option").eq(1).check()
  cy.goNext()
  cy.checkErrorAlert("not.exist")

  cy.getByTestId("app-preference-option").eq(1).check()
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.isNextRouteValid("preferencesAll")
})

Cypress.Commands.add("step14", () => {
  cy.goNext()
  cy.isNextRouteValid("generalPool")
})

Cypress.Commands.add("step15", () => {
  cy.getByTestId("app-demographics-ethnicity").select(filledApplication.demographics.ethnicity)
  cy.getByTestId("app-demographics-gender").select(filledApplication.demographics.gender)
  cy.getByTestId("app-demographics-sexual-orientation").select(
    filledApplication.demographics.sexualOrientation
  )
  cy.getByTestId("app-demographics-how-did-you-hear").eq(5).check()

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("demographics")
})

Cypress.Commands.add("step16", () => {
  cy.getByTestId("app-summary-confirm").click()
  cy.isNextRouteValid("summary")
})

Cypress.Commands.add("step17", () => {
  cy.getByTestId("app-terms-agree").check()
  cy.getByTestId("app-terms-submit-button").click()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/review/confirmation")
  cy.getByTestId("app-confirmation-id").should("be.visible").and("not.be.empty")
})

Cypress.Commands.add("isNextRouteValid", (currentStep, skip = 0) => {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const nextRouteIndex =
    applicationStepOrder.findIndex((item) => item.name === currentStep) + 1 + skip
  const nextRoutePath = applicationStepOrder[nextRouteIndex].route
    ? applicationStepOrder[nextRouteIndex].route
    : ""

  cy.location("pathname").should("include", nextRoutePath)
})

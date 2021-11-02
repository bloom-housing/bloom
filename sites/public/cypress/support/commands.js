/* eslint-disable no-undef */
import {
  applicationStepOrder,
  contactPreferencesCheckboxesOrder,
  alternateContactTypeRadioOrder,
  howDidYouHearCheckboxesOrder,
} from "./../mockData/applicationData"

// Sign into the application as an admin
Cypress.Commands.add("signIn", () => {
  cy.get(`[data-test-id="sign-in-email-field"]`).type("admin@example.com")
  cy.get(`[data-test-id="sign-in-password-field"]`).type("abcdef")
  cy.get(`[data-test-id="sign-in-button"]`).click()
})

// Go to the next step in an application
Cypress.Commands.add("goNext", () => {
  return cy.get(`[data-test-id="app-next-step-button"]`).click()
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

Cypress.Commands.add("step1PrimaryApplicantName", (application) => {
  cy.getByTestId("app-primary-first-name").type(application.applicant.firstName)
  cy.getByTestId("app-primary-middle-name").type(application.applicant.middleName)
  cy.getByTestId("app-primary-last-name").type(application.applicant.lastName)
  cy.getByTestId("dob-field-month").type(application.applicant.birthMonth)
  cy.getByTestId("dob-field-day").type(application.applicant.birthDay)
  cy.getByTestId("dob-field-year").type(application.applicant.birthYear)
  cy.getByTestId("app-primary-email").type(application.applicant.emailAddress)
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("primaryApplicantName")
})

Cypress.Commands.add("step2PrimaryApplicantAddresses", (application) => {
  cy.getPhoneFieldByTestId("app-primary-phone-number").type(application.applicant.phoneNumber)
  cy.getByTestId("app-primary-phone-number-type").select(application.applicant.phoneNumberType)

  if (application.additionalPhoneNumber) {
    cy.getByTestId("app-primary-additional-phone").check()
    cy.getPhoneFieldByTestId("app-primary-additional-phone-number").type(
      application.additionalPhoneNumber
    )
    cy.getByTestId("app-primary-additional-phone-number-type").select(
      application.additionalPhoneNumberType
    )
  }

  cy.getByTestId("app-primary-address-street").type(application.applicant.address.street)
  cy.getByTestId("app-primary-address-street2").type(application.applicant.address.street2)
  cy.getByTestId("app-primary-address-city").type(application.applicant.address.city)
  cy.getByTestId("app-primary-address-state").select(application.applicant.address.state)
  cy.getByTestId("app-primary-address-zip").type(application.applicant.address.zipCode)

  if (application.sendMailToMailingAddress) {
    cy.getByTestId("app-primary-send-to-mailing").check()
    cy.getByTestId("app-primary-mailing-address-street").type(application.mailingAddress.street2)
    cy.getByTestId("app-primary-mailing-address-street2").type(application.mailingAddress.street2)
    cy.getByTestId("app-primary-mailing-address-city").type(application.mailingAddress.city)
    cy.getByTestId("app-primary-mailing-address-state").select(application.mailingAddress.state)
    cy.getByTestId("app-primary-mailing-address-zip").type(application.mailingAddress.zipCode)
  }

  application.contactPreferences.forEach((contactPreference) => {
    const contactPreferenceIndex = contactPreferencesCheckboxesOrder.indexOf(contactPreference)
    cy.getByTestId("app-primary-contact-preference").eq(contactPreferenceIndex).check()
  })

  if (application.applicant.workInRegion) {
    cy.getByTestId("app-primary-work-in-region-yes").check()
    cy.getByTestId("app-primary-work-address-street").type(application.applicant.workAddress.street)
    cy.getByTestId("app-primary-work-address-street2").type(
      application.applicant.workAddress.street2
    )
    cy.getByTestId("app-primary-work-address-city").type(application.applicant.workAddress.city)
    cy.getByTestId("app-primary-work-address-state").select(application.applicant.workAddress.state)
    cy.getByTestId("app-primary-work-address-zip").type(application.applicant.workAddress.zipCode)
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("primaryApplicantAddress")
})

Cypress.Commands.add("step3AlternateContactType", (application) => {
  const alternateContactTypeIndex = alternateContactTypeRadioOrder.indexOf(
    application.alternateContact.type
  )
  cy.getByTestId("app-alternate-type").eq(alternateContactTypeIndex).check()

  if (application.alternateContact.type === "other") {
    cy.get("[data-test-id=app-alternate-other-type]").type(application.alternateContact.otherType)
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactType")
})

Cypress.Commands.add("step4AlternateContactName", (application) => {
  cy.getByTestId("app-alternate-first-name").type(application.alternateContact.firstName)
  cy.getByTestId("app-alternate-last-name").type(application.alternateContact.lastName)
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactName")
})

Cypress.Commands.add("step5AlternateContactInfo", (application) => {
  cy.getPhoneFieldByTestId("app-alternate-phone-number").type(
    application.alternateContact.phoneNumber
  )
  cy.getByTestId("app-alternate-email").type(application.alternateContact.emailAddress)
  cy.getByTestId("app-alternate-mailing-address-street").type(
    application.alternateContact.mailingAddress.street
  )
  cy.getByTestId("app-alternate-mailing-address-city").type(
    application.alternateContact.mailingAddress.city
  )
  cy.getByTestId("app-alternate-mailing-address-state").select(
    application.alternateContact.mailingAddress.state
  )
  cy.getByTestId("app-alternate-mailing-address-zip").type(
    application.alternateContact.mailingAddress.zipCode
  )

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactInfo")
})

Cypress.Commands.add("step6HouseholdSize", (application) => {
  if (application.householdMembers.length > 0) {
    cy.getByTestId("app-household-live-with-others").click()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "applications/household/members-info")
  } else {
    cy.getByTestId("app-household-live-alone").click()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "applications/household/preferred-units")
    cy.isNextRouteValid("liveAlone")
  }
})

Cypress.Commands.add("step7AddHouseholdMembers", (application) => {
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/household/add-members")

  application.householdMembers.forEach((householdMember) => {
    cy.getByTestId("app-add-household-member-button").click()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "applications/household/member")

    cy.getByTestId("app-household-member-first-name").type(householdMember.firstName)
    cy.getByTestId("app-household-member-middle-name").type(householdMember.middleName)
    cy.getByTestId("app-household-member-last-name").type(householdMember.lastName)
    cy.getByTestId("dob-field-month").type(householdMember.birthMonth)
    cy.getByTestId("dob-field-day").type(householdMember.birthDay)
    cy.getByTestId("dob-field-year").type(householdMember.birthYear)

    if (householdMember.sameAddress === "no") {
      cy.getByTestId("app-household-member-same-address").eq(1).check()
      cy.getByTestId("app-household-member-address-street").type(householdMember.address.street)
      cy.getByTestId("app-household-member-address-street2").type(householdMember.address.street2)
      cy.getByTestId("app-household-member-address-city").type(householdMember.address.city)
      cy.getByTestId("app-household-member-address-state").select(householdMember.address.state)
      cy.getByTestId("app-household-member-address-zip").type(householdMember.address.zipCode)
    } else {
      cy.getByTestId("app-household-member-same-address").eq(0).check()
    }

    if (householdMember.workInRegion === "yes") {
      cy.getByTestId("app-household-member-work-in-region").eq(0).check()
      cy.getByTestId("app-household-member-work-address-street").type(
        householdMember.workAddress.street
      )
      cy.getByTestId("app-household-member-work-address-street2").type(
        householdMember.workAddress.street2
      )
      cy.getByTestId("app-household-member-work-address-city").type(
        householdMember.workAddress.city
      )
      cy.getByTestId("app-household-member-work-address-state").select(
        householdMember.workAddress.state
      )
      cy.getByTestId("app-household-member-work-address-zip").type(
        householdMember.workAddress.zipCode
      )
    } else {
      cy.getByTestId("app-household-member-work-in-region").eq(1).check()
    }

    cy.getByTestId("app-household-member-relationship").select(householdMember.relationship)

    cy.getByTestId("app-household-member-save").click()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "/applications/household/add-members")
  })
  cy.getByTestId("app-done-household-members-button").click()
})

Cypress.Commands.add("step9PreferredUnits", (application) => {
  application.preferredUnit.forEach((_, index) => {
    cy.getByTestId("app-preferred-units").eq(index).check()
  })
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("preferredUnitSize")
})

Cypress.Commands.add("step10Accessibility", (application) => {
  if (application.accessibility.mobility) {
    cy.getByTestId("app-ada-mobility").check()
  }
  if (application.accessibility.vision) {
    cy.getByTestId("app-ada-vision").check()
  }
  if (application.accessibility.hearing) {
    cy.getByTestId("app-ada-hearing").check()
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("adaHouseholdMembers")
})

Cypress.Commands.add("step11IncomeVouchers", (application) => {
  if (application.incomeVouchers) {
    cy.getByTestId("app-income-vouchers").eq(0).check()
  } else {
    cy.getByTestId("app-income-vouchers").eq(1).check()
  }
  cy.goNext()

  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("vouchersSubsidies")
})

Cypress.Commands.add("step12Income", (application) => {
  cy.getByTestId("app-income").type(application.income)
  if (application.incomePeriod === "perMonth") {
    cy.getByTestId("app-income-period").eq(1).check()
  } else {
    cy.getByTestId("app-income-period").eq(0).check()
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("income")
})

Cypress.Commands.add("step13SelectPreferences", (application) => {
  let preferenceClaimed = false
  application.preferences.forEach((preference) => {
    if (!preference.claimed) {
      // Selects the last instance, which is decline
      cy.getByTestId("app-preference-option").check()
    } else {
      preferenceClaimed = true
      preference.options.forEach((option, index) => {
        if (option.checked) {
          cy.getByTestId("app-preference-option").eq(index).check()
        }
      })
    }
    cy.goNext()
  })
  if (preferenceClaimed) {
    // Skip general pool step
    cy.isNextRouteValid("preferencesAll", 1)
  } else {
    cy.isNextRouteValid("preferencesAll")
  }
})

Cypress.Commands.add("step14GeneralPool", () => {
  cy.goNext()
  cy.isNextRouteValid("generalPool")
})

Cypress.Commands.add("step15Demographics", (application) => {
  cy.getByTestId("app-demographics-ethnicity").select(application.demographics.ethnicity)
  cy.getByTestId("app-demographics-race").select(application.demographics.race)
  cy.getByTestId("app-demographics-gender").select(application.demographics.gender)
  cy.getByTestId("app-demographics-sexual-orientation").select(
    application.demographics.sexualOrientation
  )

  application.demographics.howDidYouHear.forEach((howDidYouHear) => {
    const howDidYouHearIndex = howDidYouHearCheckboxesOrder.indexOf(howDidYouHear)
    cy.getByTestId("app-demographics-how-did-you-hear").eq(howDidYouHearIndex).check()
  })

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("demographics")
})

Cypress.Commands.add("step16Summary", (application) => {
  // TODO check values
  cy.getByTestId("app-summary-confirm").click()
  cy.isNextRouteValid("summary")
})

Cypress.Commands.add("step17TermsAndSubmit", (application) => {
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

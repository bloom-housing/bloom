/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/restrict-plus-operands */

import {
  applicationStepOrder,
  contactPreferencesCheckboxesOrder,
  alternateContactTypeRadioOrder,
  howDidYouHearCheckboxesOrder,
} from "./../mockData/applicationData"

Cypress.Commands.add("signIn", (email, password) => {
  cy.get(`[data-testid="sign-in-email-field"]`).type(email ?? "admin@example.com")
  cy.getByID("use-password-instead").click()
  cy.get(`[data-testid="sign-in-password-field"]`).type(password ?? "abcdef")
  cy.getByID("sign-in-button").click()
})

Cypress.Commands.add("signOut", () => {
  cy.get(`[data-testid="My Account-4"]`).trigger("mouseover")
  cy.get(`[data-testid="Sign Out-3"]`).trigger("click")
})

Cypress.Commands.add("goNext", () => {
  return cy.getByID("app-next-step-button").click()
})

Cypress.Commands.add("getByID", (id, ...args) => {
  return cy.get(`[id="${CSS.escape(id)}"]`, ...args)
})

Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add("getPhoneFieldByTestId", (testId) => {
  return cy.get(`[data-testid="${testId}"]`).find("input")
})

Cypress.Commands.add("checkErrorAlert", (command) => {
  cy.getByID("application-alert-box").should(command)
})

Cypress.Commands.add("checkErrorMessages", (command) => {
  cy.get(`[data-testid="error-message"]`).should(command)
})

Cypress.Commands.add("beginApplicationRejectAutofill", (listingName) => {
  cy.visit("/")
  cy.getByTestId("View Listings-1").click()
  cy.getByTestId("map-pagination").should("include.text", "(Page 1 of 10)")
  cy.getByTestId("loading-overlay").should("not.exist")
  cy.get(".is-card-link").contains(listingName).click({ force: true })
  cy.getByID("listing-view-apply-button").eq(1).click()
  cy.get("[data-testid=sign-in-email-field]").type("admin@example.com")
  cy.getByID("use-password-instead").click()
  cy.get("[data-testid=sign-in-password-field]").type("abcdef")
  cy.getByID("sign-in-button").click()
  cy.getByID("app-choose-language-button").eq(0).click()
  cy.getByID("app-next-step-button").click()
  cy.getByID("application-initial-page").then(() => {
    cy.get("h2").then(($header) => {
      const headerText = $header.text()
      if (headerText.includes("Save time by using the details from your last application")) {
        cy.getByID("autofill-decline").click()
      } else {
        cy.getByID("app-next-step-button").click()
      }
    })
  })
  cy.getByID("app-next-step-button").click()
})

Cypress.Commands.add("beginApplicationSignedIn", (listingName) => {
  cy.visit("/listings")
  cy.getByTestId("map-pagination").should("include.text", "(Page 1 of 10)")
  cy.getByTestId("loading-overlay").should("not.exist")
  cy.get(".is-card-link").contains(listingName).click({ force: true })
  cy.getByID("listing-view-apply-button").eq(1).click()
  cy.getByID("app-choose-language-button").eq(0).click()
  cy.getByID("app-next-step-button").click()
  cy.getByID("autofill-decline").click()
})

Cypress.Commands.add("step1PrimaryApplicantName", (application) => {
  cy.getByTestId("app-primary-first-name").type(application.applicant.firstName)
  if (application.applicant.middleName) {
    cy.getByTestId("app-primary-middle-name").type(application.applicant.middleName)
  }
  cy.getByTestId("app-primary-last-name").type(application.applicant.lastName)
  cy.getByTestId("dob-field-month").type(application.applicant.birthMonth)
  cy.getByTestId("dob-field-day").type(application.applicant.birthDay)
  cy.getByTestId("dob-field-year").type(application.applicant.birthYear)
  if (application.applicant.noEmail) {
    cy.getByTestId("app-primary-no-email").check()
  } else {
    cy.getByTestId("app-primary-email").type(application.applicant.emailAddress)
  }
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("primaryApplicantName")
})

Cypress.Commands.add("step2PrimaryApplicantAddresses", (application) => {
  if (application.applicant.noPhone) {
    cy.getByTestId("app-primary-no-phone").check()
  } else {
    cy.getPhoneFieldByTestId("app-primary-phone-number").type(application.applicant.phoneNumber)
    cy.getByTestId("app-primary-phone-number-type").select(application.applicant.phoneNumberType)
  }

  if (application.additionalPhoneNumber) {
    cy.getByTestId("app-primary-additional-phone").check()
    cy.getPhoneFieldByTestId("app-primary-additional-phone-number").type(
      application.additionalPhoneNumber
    )
    cy.getByTestId("app-primary-additional-phone-number-type").select(
      application.additionalPhoneNumberType
    )
  }

  cy.getByTestId("app-primary-address-street").type(application.applicant.applicantAddress.street)
  cy.getByTestId("app-primary-address-street2").type(application.applicant.applicantAddress.street2)
  cy.getByTestId("app-primary-address-city").type(application.applicant.applicantAddress.city)
  cy.getByTestId("app-primary-address-state").select(application.applicant.applicantAddress.state)
  cy.getByTestId("app-primary-address-zip").type(application.applicant.applicantAddress.zipCode)

  if (application.sendMailToMailingAddress) {
    cy.getByTestId("app-primary-send-to-mailing").check()
    cy.getByTestId("app-primary-mailing-address-street").type(
      application.applicationsMailingAddress.street
    )
    cy.getByTestId("app-primary-mailing-address-street2").type(
      application.applicationsMailingAddress.street2
    )
    cy.getByTestId("app-primary-mailing-address-city").type(
      application.applicationsMailingAddress.city
    )
    cy.getByTestId("app-primary-mailing-address-state").select(
      application.applicationsMailingAddress.state
    )
    cy.getByTestId("app-primary-mailing-address-zip").type(
      application.applicationsMailingAddress.zipCode
    )
  }

  application.contactPreferences.forEach((contactPreference) => {
    const contactPreferenceIndex = contactPreferencesCheckboxesOrder.indexOf(contactPreference)
    cy.getByTestId("app-primary-contact-preference").eq(contactPreferenceIndex).check()
  })

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.getByTestId("app-found-address-choice").should("exist")

  cy.goNext() // accept validated address
  cy.isNextRouteValid("primaryApplicantAddress")
})

Cypress.Commands.add("step3AlternateContactType", (application) => {
  const alternateContactTypeIndex = alternateContactTypeRadioOrder.indexOf(
    application.alternateContact.type
  )
  cy.getByTestId("app-alternate-type").eq(alternateContactTypeIndex).check()

  if (application.alternateContact.type === "other") {
    cy.get("[data-testid=app-alternate-other-type]").type(application.alternateContact.otherType)
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
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
    application.alternateContact.address.street
  )
  cy.getByTestId("app-alternate-mailing-address-street2").type(
    application.alternateContact.address.street2
  )
  cy.getByTestId("app-alternate-mailing-address-city").type(
    application.alternateContact.address.city
  )
  cy.getByTestId("app-alternate-mailing-address-state").select(
    application.alternateContact.address.state
  )
  cy.getByTestId("app-alternate-mailing-address-zip").type(
    application.alternateContact.address.zipCode
  )

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("alternateContactInfo")
})

Cypress.Commands.add("step6HouseholdSize", (application) => {
  if (application.householdMember.length > 0) {
    cy.getByID("householdSizeLiveWithOthers").click()
    cy.goNext()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "applications/household/members-info")
  } else {
    cy.getByID("householdSizeLiveAlone").click()
    cy.goNext()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "applications/household/preferred-units")
  }
})

Cypress.Commands.add("step7AddHouseholdMembers", (application) => {
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/household/add-members")

  application.householdMember.forEach((householdMember) => {
    cy.getByID("app-add-household-member-button").click()
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
      cy.getByTestId("app-household-member-address-street").type(
        householdMember.householdMemberAddress.street
      )
      cy.getByTestId("app-household-member-address-street2").type(
        householdMember.householdMemberAddress.street2
      )
      cy.getByTestId("app-household-member-address-city").type(
        householdMember.householdMemberAddress.city
      )
      cy.getByTestId("app-household-member-address-state").select(
        householdMember.householdMemberAddress.state
      )
      cy.getByTestId("app-household-member-address-zip").type(
        householdMember.householdMemberAddress.zipCode
      )
    } else {
      cy.getByTestId("app-household-member-same-address").eq(0).check()
    }

    cy.getByTestId("app-household-member-relationship").select(householdMember.relationship)

    cy.getByID("app-household-member-save").click()
    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.location("pathname").should("include", "/applications/household/add-members")
  })
  cy.goNext()
})

Cypress.Commands.add("step8PreferredUnits", (application) => {
  application.preferredUnitTypes.forEach((prefUnit) => {
    cy.getByTestId(prefUnit.name).check()
  })
  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("preferredUnitSize")
})

Cypress.Commands.add("step9Accessibility", (application) => {
  if (application.accessibility.mobility) {
    cy.getByTestId("app-ada-mobility").check()
  }
  if (application.accessibility.vision) {
    cy.getByTestId("app-ada-vision").check()
  }
  if (application.accessibility.hearing) {
    cy.getByTestId("app-ada-hearing").check()
  }
  if (
    !application.accessibility.hearing &&
    !application.accessibility.hearing &&
    !application.accessibility.mobility
  ) {
    cy.getByTestId("app-ada-none").check()
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  if (application.programs.length) {
    cy.isNextRouteValid("adaHouseholdMembers")
  } else {
    cy.isNextRouteValid("adaHouseholdMembers", 1)
  }
})

Cypress.Commands.add("step12Programs", (application) => {
  application.programs.forEach((program) => {
    if (!program.claimed) {
      // Selects the last instance, which is decline
      cy.getByTestId("app-question-option").check()
    } else {
      program.options.forEach((option, index) => {
        if (option.checked) {
          cy.getByTestId("app-question-option").eq(index).check()
        }
      })
    }
    cy.goNext()
  })

  cy.isNextRouteValid("programs")
})

Cypress.Commands.add("step10Changes", (application) => {
  if (application.householdExpectingChanges) {
    cy.getByTestId("app-expecting-changes").eq(0).check()
  } else {
    cy.getByTestId("app-expecting-changes").eq(1).check()
  }
  cy.goNext()

  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("householdExpectingChanges")
})

Cypress.Commands.add("step11Student", (application, programsExist) => {
  if (application.householdStudent) {
    cy.getByTestId("app-student").eq(0).check()
  } else {
    cy.getByTestId("app-student").eq(1).check()
  }
  cy.goNext()

  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("householdStudent", !programsExist ? 1 : 0)
})

Cypress.Commands.add("step13IncomeVouchers", (application) => {
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

Cypress.Commands.add("step14Income", (application) => {
  cy.getByTestId("app-income").type(application.income, { force: true })
  if (application.incomePeriod === "perMonth") {
    cy.getByTestId("app-income-period").eq(0).check()
  } else {
    cy.getByTestId("app-income-period").eq(1).check()
  }

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
})

Cypress.Commands.add("step15SelectPreferences", (application) => {
  let preferenceClaimed = false
  application.preferences.forEach((preference) => {
    preferenceClaimed = true
    preference.options.forEach((option, index) => {
      if (option.checked) {
        cy.getByTestId("app-question-option").eq(index).check()
      }
      if (option.address) {
        cy.get(`[data-testid="address-street"]`).eq(index).type(option.address.street)
        cy.get(`[data-testid="address-city"]`).eq(index).type(option.address.city)
        cy.get(`[data-testid="address-state"]`).eq(index).select(option.address.state)
        cy.get(`[data-testid="address-zipcode"]`).eq(index).type(option.address.zipCode)
      }
      if (option.addressHolder) {
        cy.get(`[data-testid="addressHolder-name"]`).eq(index).type(option.addressHolder.name)
        cy.get(`[data-testid="addressHolder-relationship"]`)
          .eq(index)
          .type(option.addressHolder.relationship)
      }
    })

    // All options with an address need to have it verified
    const optionsWithAddress = preference.options.filter((option) => option.address)
    optionsWithAddress?.forEach(() => {
      cy.goNext()
    })

    cy.goNext()
  })
  if (preferenceClaimed) {
    // Skip general pool step
    cy.isNextRouteValid("preferencesAll", 1)
  } else {
    cy.isNextRouteValid("preferencesAll")
  }
})

Cypress.Commands.add("step16GeneralPool", () => {
  cy.location("pathname").should("include", "applications/preferences/general")
  cy.goNext()
  cy.isNextRouteValid("generalPool")
})

Cypress.Commands.add("step17Demographics", (application) => {
  cy.location("pathname").should("include", "applications/review/demographics")
  application.demographics.race.forEach((race) => {
    cy.getByTestId(race).check()
  })

  if (application.demographics.ethnicity) {
    cy.getByTestId("app-demographics-ethnicity").select(application.demographics.ethnicity)
  }

  application.demographics.howDidYouHear.forEach((howDidYouHear) => {
    const howDidYouHearIndex = howDidYouHearCheckboxesOrder.indexOf(howDidYouHear)
    cy.getByTestId("app-demographics-how-did-you-hear").eq(howDidYouHearIndex).check()
  })

  cy.goNext()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.isNextRouteValid("demographics")
})

Cypress.Commands.add("step18Summary", (application, verify) => {
  const fields = [
    {
      id: "app-summary-applicant-name",
      fieldValue: `${application.applicant.firstName}${
        application.applicant.middleName ? ` ${application.applicant.middleName}` : ``
      } ${application.applicant.lastName}`,
    },
    {
      id: "app-summary-applicant-dob",
      fieldValue: `${application.applicant.birthMonth}/${application.applicant.birthDay}/${application.applicant.birthYear}`,
    },
    { id: "app-summary-applicant-phone", fieldValue: application.applicant.phoneNumber },
    {
      id: "app-summary-applicant-email",
      fieldValue: application.applicant.emailAddress,
    },
    {
      id: "app-summary-applicant-address",
      fieldValue: application.applicant.applicantAddress.street,
    },
    {
      id: "app-summary-applicant-address",
      fieldValue: application.applicant.applicantAddress.street2,
    },
    {
      id: "app-summary-applicant-address",
      fieldValue: `${application.applicant.applicantAddress.city}, ${application.applicant.applicantAddress.state} ${application.applicant.applicantAddress.zipCode}`,
    },

    {
      id: "app-summary-contact-preference-type",
      fieldValue: application.contactPreferences[0],
    },
    {
      id: "app-summary-preferred-units",
      fieldValue: application.preferredUnitTypes
        .reduce((acc, item) => {
          acc.push(item.name)
          return acc
        }, [])
        .join(", "),
    },
    {
      id: "app-summary-household-changes",
      fieldValue: application.householdExpectingChanges ? "Yes" : "No",
    },
    {
      id: "app-summary-household-student",
      fieldValue: application.householdStudent ? "Yes" : "No",
    },
    {
      id: "app-summary-income-vouchers",
      fieldValue: application.incomeVouchers ? "Yes" : "No",
    },
    {
      id: "app-summary-income",
      fieldValue: parseFloat(application.income).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      id: "app-summary-income",
      fieldValue: application.incomePeriod === "perMonth" ? "per month" : "per year",
    },
  ]

  if (application.accessibility.mobility) {
    const val = "For Mobility Impairments"
    fields.push({ id: val, fieldValue: val })
  }
  if (application.accessibility.vision) {
    const val = "For Vision Impairments"
    fields.push({ id: val, fieldValue: val })
  }
  if (application.accessibility.hearing) {
    const val = "For Hearing Impairments"
    fields.push({ id: val, fieldValue: val })
  }

  if (application.alternateContact.type !== "noContact") {
    fields.push({
      id: "app-summary-alternate-name",
      fieldValue: `${application.alternateContact.firstName} ${application.alternateContact.lastName}`,
    })
    fields.push({
      id: "app-summary-alternate-email",
      fieldValue: application.alternateContact.emailAddress,
    })
    fields.push({
      id: "app-summary-alternate-phone",
      fieldValue: application.alternateContact.phoneNumber,
    })
    fields.push({
      id: "app-summary-alternate-mailing-address",
      fieldValue: application.alternateContact.address.street,
    })
    fields.push({
      id: "app-summary-alternate-mailing-address",
      fieldValue: application.alternateContact.address.street2,
    })
    fields.push({
      id: "app-summary-alternate-mailing-address",
      fieldValue: `${application.alternateContact.address.city}, ${application.alternateContact.address.state} ${application.alternateContact.address.zipCode}`,
    })
  }

  application.householdMember.forEach((member) => {
    fields.push({
      id: "app-summary-household-member-name",
      fieldValue: `${member.firstName} ${member.lastName}`,
    })
    fields.push({
      id: "app-summary-household-member-dob",
      fieldValue: `${member.birthMonth}/${member.birthDay}/${member.birthYear}`,
    })
    fields.push({
      id: "app-summary-household-member-address",
      fieldValue: `${member.householdMemberAddress.street} ${member.householdMemberAddress.street2} ${member.householdMemberAddress.city}, ${member.householdMemberAddress.state} ${member.householdMemberAddress.zipCode}`,
    })
  })

  const pushMultiselect = (section) => {
    application[section]
      .filter((item) => item.claimed)
      .forEach((claimedPref) => {
        fields.push({ id: claimedPref.key, fieldValue: claimedPref.key })
        claimedPref.options
          .filter((opt) => opt.checked)
          .forEach((optionClaimed) => {
            if (optionClaimed.address) {
              fields.push({
                id: claimedPref.key,
                fieldValue: optionClaimed.address.street,
              })
              fields.push({
                id: claimedPref.key,
                fieldValue: `${optionClaimed.address.city}, ${optionClaimed.address.state} ${optionClaimed.address.zipCode}`,
              })
            }
            if (optionClaimed.addressHolder) {
              fields.push({
                id: claimedPref.key,
                fieldValue: optionClaimed.addressHolder.name,
              })
              fields.push({
                id: claimedPref.key,
                fieldValue: optionClaimed.addressHolder.relationship,
              })
            }
          })
      })
  }
  pushMultiselect("preferences")
  pushMultiselect("programs")

  if (verify) {
    fields.forEach(({ id, fieldValue }) => {
      cy.getByTestId(id).contains(fieldValue, { matchCase: false }).should("be.visible")
    })
  }

  cy.getByID("app-summary-confirm").click()
  cy.isNextRouteValid("summary")
})

Cypress.Commands.add("step19TermsAndSubmit", () => {
  cy.getByTestId("app-terms-agree").check()
  cy.getByID("app-terms-submit-button").click()
  cy.checkErrorAlert("not.exist")
  cy.checkErrorMessages("not.exist")
  cy.location("pathname").should("include", "applications/review/confirmation")
  cy.getByTestId("app-confirmation-id").should("be.visible").and("not.be.empty")
})

Cypress.Commands.add("submitApplication", (listingName, application, verify) => {
  cy.beginApplicationRejectAutofill(listingName)
  cy.step1PrimaryApplicantName(application)
  cy.step2PrimaryApplicantAddresses(application)
  cy.step3AlternateContactType(application)
  if (application.alternateContact.type !== "noContact") {
    cy.step4AlternateContactName(application)
    cy.step5AlternateContactInfo(application)
  }
  cy.step6HouseholdSize(application)
  if (application.householdMember.length > 0) {
    cy.step7AddHouseholdMembers(application)
  }
  cy.step8PreferredUnits(application)
  cy.step9Accessibility(application)
  cy.step10Changes(application)

  cy.window().then((win) => {
    const listing = JSON.parse(win.sessionStorage.getItem("bloom-app-listing"))
    const listingQuestionSectionExists = (sectionTitle) => {
      return (
        listing.listingMultiselectQuestions?.filter(
          (question) => question.multiselectQuestions.applicationSection === sectionTitle
        )?.length > 0
      )
    }
    const programsExist = listingQuestionSectionExists("programs")
    const preferencesExist = listingQuestionSectionExists("preferences")

    cy.step11Student(application, programsExist)

    if (programsExist) {
      cy.step12Programs(application)
    }

    cy.step13IncomeVouchers(application)
    cy.step14Income(application)
    if (preferencesExist) {
      if (application.preferences.length > 0) {
        cy.step15SelectPreferences(application)
      } else {
        cy.step16GeneralPool()
      }
    }

    cy.step17Demographics(application)
    cy.step18Summary(application, verify)
    cy.step19TermsAndSubmit(application)
  })
})

Cypress.Commands.add("isNextRouteValid", (currentStep, skip = 0) => {
  const nextRouteIndex =
    applicationStepOrder.findIndex((item) => item.name === currentStep) + 1 + skip
  const nextRoutePath = applicationStepOrder[nextRouteIndex].route
    ? applicationStepOrder[nextRouteIndex].route
    : ""
  cy.location("pathname").should("include", nextRoutePath)
})

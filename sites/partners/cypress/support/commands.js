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
import "cypress-file-upload"

Cypress.Commands.add("getByID", (id, ...args) => {
  return cy.get(`#${CSS.escape(id)}`, ...args)
})

Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-test-id="${testId}"]`)
})

Cypress.Commands.add("loginAndAcceptTerms", () => {
  cy.visit("/")
  cy.fixture("user").then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get(".button").contains("Sign In").click()
    cy.getByTestId("agree").check()
    cy.getByTestId("form-submit").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("login", () => {
  cy.visit("/")
  cy.fixture("user").then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get(".button").contains("Sign In").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("loginWithMfa", () => {
  cy.visit("/")
  cy.fixture("mfaUser").then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get(".button").contains("Sign In").click()
    cy.getByTestId("verify-by-email").click()
    cy.getByTestId("sign-in-mfa-code-field").type(user.mfaCode)
    cy.getByTestId("verify-and-sign-in").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("signOut", () => {
  cy.get("button").contains("Sign Out").click()
  cy.get("input#email")
})

Cypress.Commands.add("verifyAlertBox", () => {
  cy.get(".status-aside__buttons > .grid-section > .grid-section__inner > :nth-child(1) > .button")
    .contains("Publish")
    .click()
  cy.get("[data-testid=footer] > .grid-section > .grid-section__inner > :nth-child(1) > .button")
    .contains("Publish")
    .click()
  cy.get(".alert-box").contains(
    "Please resolve any errors before saving or publishing your listing."
  )
})

const processSet = (application, set, fieldsToSkip, command) => {
  if (set.length) {
    set.forEach(({ id, fieldKey }) => {
      if (!fieldsToSkip.includes(id)) {
        if (command === "type") {
          cy.getByID(id).type(application[fieldKey])
        } else if (command === "select") {
          cy.getByID(id).select(application[fieldKey])
        } else if (command === "click") {
          cy.getByID(fieldKey).click()
        }
      }
    })
  }
}

const fillFields = (application, fieldsToType, fieldsToSelect, fieldsToClick, fieldsToSkip) => {
  processSet(application, fieldsToType, fieldsToSkip, "type")
  processSet(application, fieldsToSelect, fieldsToSkip, "select")
  processSet(application, fieldsToClick, fieldsToSkip, "click")
}

Cypress.Commands.add("fillPrimaryApplicant", (application, fieldsToSkip = []) => {
  const fieldsToType = [
    { id: "application.applicant.firstName", fieldKey: "applicant.firstName" },
    { id: "application.applicant.middleName", fieldKey: "applicant.middleName" },
    { id: "application.applicant.lastName", fieldKey: "applicant.lastName" },
    { id: "dateOfBirth.birthMonth", fieldKey: "dateOfBirth.birthMonth" },
    { id: "dateOfBirth.birthDay", fieldKey: "dateOfBirth.birthDay" },
    { id: "dateOfBirth.birthYear", fieldKey: "dateOfBirth.birthYear" },
    { id: "application.applicant.emailAddress", fieldKey: "applicant.emailAddress" },
    { id: "phoneNumber", fieldKey: "phoneNumber" },
    { id: "application.additionalPhoneNumber", fieldKey: "additionalPhoneNumber" },
    { id: "application.applicant.address.street", fieldKey: "applicant.address.street" },
    { id: "application.applicant.address.street2", fieldKey: "applicant.address.street2" },
    { id: "application.applicant.address.city", fieldKey: "applicant.address.city" },
    { id: "application.applicant.address.zipCode", fieldKey: "applicant.address.zipCode" },
  ]

  const fieldsToSelect = [
    { id: "application.language", fieldKey: "language" },
    { id: "application.applicant.phoneNumberType", fieldKey: "applicant.phoneNumberType" },
    { id: "application.additionalPhoneNumberType", fieldKey: "additionalPhoneNumberType" },
    { id: "application.applicant.address.state", fieldKey: "applicant.address.state" },
  ]

  const fieldsToClick = [
    {
      id: "application.applicant.workInRegion",
      fieldKey: `application.applicant.workInRegion${application["applicant.workInRegion"]}`,
    },
    { id: "email", fieldKey: "email" },
  ]

  fillFields(application, fieldsToType, fieldsToSelect, fieldsToClick, fieldsToSkip)
})

Cypress.Commands.add("fillAlternateContact", (application, fieldsToSkip = []) => {
  const fieldsToType = [
    { id: "application.alternateContact.firstName", fieldKey: "alternateContact.firstName" },
    { id: "application.alternateContact.lastName", fieldKey: "alternateContact.lastName" },
    { id: "application.alternateContact.agency", fieldKey: "alternateContact.agency" },
    { id: "application.alternateContact.emailAddress", fieldKey: "alternateContact.emailAddress" },
    { id: "application.alternateContact.phoneNumber", fieldKey: "alternateContact.phoneNumber" },
    {
      id: "application.alternateContact.mailingAddress.street",
      fieldKey: "alternateContact.mailingAddress.street",
    },
    {
      id: "application.alternateContact.mailingAddress.street2",
      fieldKey: "alternateContact.mailingAddress.street2",
    },
    {
      id: "application.alternateContact.mailingAddress.city",
      fieldKey: "alternateContact.mailingAddress.city",
    },
    {
      id: "application.alternateContact.mailingAddress.zipCode",
      fieldKey: "alternateContact.mailingAddress.zipCode",
    },
  ]

  const fieldsToSelect = [
    { id: "application.alternateContact.type", fieldKey: "alternateContact.type" },
    {
      id: "application.alternateContact.mailingAddress.state",
      fieldKey: "alternateContact.mailingAddress.state",
    },
  ]

  fillFields(application, fieldsToType, fieldsToSelect, [], fieldsToSkip)
})

Cypress.Commands.add("fillHouseholdMember", (application, fieldsToSkip = []) => {
  cy.getByTestId("addHouseholdMemberButton").click()

  const fieldsToType = [
    { id: "firstName", fieldKey: "firstName" },
    { id: "middleName", fieldKey: "middleName" },
    { id: "lastName", fieldKey: "lastName" },
  ]

  const fieldsToSelect = [{ id: "relationship", fieldKey: "relationship" }]

  const fieldsToClick = [
    {
      id: "sameAddress",
      fieldKey: `sameAddress${application["sameAddress"]}`,
    },
    { id: "workInRegion", fieldKey: `workInRegion${application["workInRegion"]}` },
  ]

  fillFields(application, fieldsToType, fieldsToSelect, fieldsToClick, fieldsToSkip)

  if (!fieldsToSkip.includes("dob-field-month")) {
    cy.getByTestId("dob-field-month").eq(1).type(application["dob-field-month"])
  }
  if (!fieldsToSkip.includes("dob-field-day")) {
    cy.getByTestId("dob-field-day").eq(1).type(application["dob-field-day"])
  }
  if (!fieldsToSkip.includes("dob-field-year")) {
    cy.getByTestId("dob-field-year").eq(1).type(application["dob-field-year"])
  }

  cy.getByTestId("submitAddMemberForm").click()
})

Cypress.Commands.add("fillHouseholdDetails", (application, fieldsToSkip = []) => {
  const fieldsToClick = [
    {
      id: "application.householdExpectingChanges",
      fieldKey: `application.householdExpectingChanges${application["householdExpectingChanges"]}`,
    },
    {
      id: "application.householdStudent",
      fieldKey: `application.householdStudent${application["householdStudent"]}`,
    },
  ]
  fillFields(application, [], [], fieldsToClick, fieldsToSkip)
  cy.getByTestId(`preferredUnit.${application["preferredUnit"]}`).click()
})

Cypress.Commands.add("fillHouseholdIncome", (application, fieldsToSkip = []) => {
  if (!fieldsToSkip.includes("application.incomePeriod")) {
    cy.getByID(`application.incomePeriod${application["incomePeriod"]}`).click()
  }
  if (!fieldsToSkip.includes("incomeMonth")) {
    cy.getByID("incomeMonth").type(application["incomeMonth"])
  } else if (!fieldsToSkip.includes("incomeYear")) {
    cy.getByID("incomeYear").type(application["incomeYear"])
  }
  if (!fieldsToSkip.includes("application.incomeVouchers")) {
    cy.getByID("application.incomeVouchers").select(application["incomeVouchers"])
  }
})

Cypress.Commands.add("fillDemographics", (application, fieldsToSkip = []) => {
  if (!fieldsToSkip.includes("application.demographics.ethnicity")) {
    cy.getByID("application.demographics.ethnicity").select(application["demographics.ethnicity"])
  }
  if (!fieldsToSkip.includes("americanIndianAlaskanNative")) {
    cy.getByID("americanIndianAlaskanNative").click()
  }
  if (!fieldsToSkip.includes("jurisdictionWebsite")) {
    cy.getByID("jurisdictionWebsite").click()
  }
})

Cypress.Commands.add("fillMailingAddress", (application, fieldsToSkip = []) => {
  cy.getByID("application.sendMailToMailingAddress").click()

  const fieldsToType = [
    { id: "application.mailingAddress.street", fieldKey: "mailingAddress.street" },
    { id: "application.mailingAddress.street2", fieldKey: "mailingAddress.street2" },
    { id: "application.mailingAddress.city", fieldKey: "mailingAddress.city" },
    { id: "application.mailingAddress.zipCode", fieldKey: "mailingAddress.zipCode" },
  ]

  const fieldsToSelect = [
    { id: "application.mailingAddress.state", fieldKey: "mailingAddress.state" },
  ]

  fillFields(application, fieldsToType, fieldsToSelect, [], fieldsToSkip)
})

Cypress.Commands.add("fillTerms", (application, submit) => {
  cy.getByID(`application.acceptedTerms${application["acceptedTerms"]}`).click()
  if (submit) {
    cy.getByTestId("submitApplicationButton").click()
  }
})

const verifyHelper = (application, listOfFields, fieldsToSkip) => {
  const fields = listOfFields.filter(({ id }) => !fieldsToSkip.includes(id))
  fields.forEach(({ id, fieldKey }) => {
    cy.getByTestId(id).contains(application[fieldKey]).should("have.text", application[fieldKey])
  })
}

Cypress.Commands.add("verifyApplicationData", (application, fieldsToSkip = []) => {
  cy.getByTestId("number").should("not.be.empty")
  cy.getByTestId("totalSize").should("not.be.empty")
  const fields = [
    { id: "type", fieldKey: "applicationType" },
    { id: "submittedDate", fieldKey: "submittedDate" },
    { id: "timeDate", fieldKey: "timeDate" },
    { id: "language", fieldKey: "language" },
    { id: "submittedBy", fieldKey: "submittedBy" },
  ]
  verifyHelper(application, fields, fieldsToSkip)
})

Cypress.Commands.add("verifyPrimaryApplicant", (application, fieldsToSkip = []) => {
  cy.getByTestId("emailAddress").contains(application["applicant.emailAddress"].toLowerCase())
  const fields = [
    { id: "firstName", fieldKey: "applicant.firstName" },
    { id: "middleName", fieldKey: "applicant.middleName" },
    { id: "lastName", fieldKey: "applicant.lastName" },
    { id: "dateOfBirth", fieldKey: "dateOfBirth" },
    { id: "phoneNumber", fieldKey: "formattedPhoneNumber" },
    { id: "additionalPhoneNumber", fieldKey: "formattedAdditionalPhoneNumber" },
    { id: "preferredContact", fieldKey: "preferredContact" },
    { id: "workInRegion", fieldKey: "applicant.workInRegion" },
    { id: "residenceAddress.streetAddress", fieldKey: "applicant.address.street" },
    { id: "residenceAddress.street2", fieldKey: "applicant.address.street2" },
    { id: "residenceAddress.city", fieldKey: "applicant.address.city" },
    { id: "residenceAddress.state", fieldKey: "applicant.address.stateCode" },
    { id: "residenceAddress.zipCode", fieldKey: "applicant.address.zipCode" },
    { id: "mailingAddress.streetAddress", fieldKey: "mailingAddress.street" },
    { id: "mailingAddress.street2", fieldKey: "mailingAddress.street2" },
    { id: "mailingAddress.city", fieldKey: "mailingAddress.city" },
    { id: "mailingAddress.state", fieldKey: "mailingAddress.stateCode" },
    { id: "mailingAddress.zipCode", fieldKey: "mailingAddress.zipCode" },
    { id: "workAddress.streetAddress", fieldKey: "workAddress.streetAddress" },
    { id: "workAddress.street2", fieldKey: "workAddress.street2" },
    { id: "workAddress.city", fieldKey: "workAddress.city" },
    { id: "workAddress.state", fieldKey: "workAddress.state" },
    { id: "workAddress.zipCode", fieldKey: "workAddress.zipCode" },
  ]
  verifyHelper(application, fields, fieldsToSkip)
})

Cypress.Commands.add("verifyAlternateContact", (application, fieldsToSkip = []) => {
  cy.getByTestId("alternateContact.emailAddress").contains(
    application["alternateContact.emailAddress"].toLowerCase()
  )
  const fields = [
    { id: "alternateContact.firstName", fieldKey: "alternateContact.firstName" },
    { id: "alternateContact.lastName", fieldKey: "alternateContact.lastName" },
    { id: "relationship", fieldKey: "alternateContact.type" },
    { id: "alternateContact.agency", fieldKey: "alternateContact.agency" },
    { id: "alternateContact.phoneNumber", fieldKey: "alternateContact.formattedPhoneNumber" },
    { id: "alternateContact.streetAddress", fieldKey: "alternateContact.mailingAddress.street" },
    { id: "alternateContact.street2", fieldKey: "alternateContact.mailingAddress.street2" },
    { id: "alternateContact.city", fieldKey: "alternateContact.mailingAddress.city" },
    { id: "alternateContact.state", fieldKey: "alternateContact.mailingAddress.stateCode" },
    { id: "alternateContact.zipCode", fieldKey: "alternateContact.mailingAddress.zipCode" },
  ]
  verifyHelper(application, fields, fieldsToSkip)
})

Cypress.Commands.add("verifyHouseholdMembers", (application, fieldsToSkip = []) => {
  ;[
    { id: `[data-label="Name"]`, fieldKey: "householdMemberName" },
    { id: `[data-label="Date of Birth"]`, fieldKey: "householdMemberDoB" },
    { id: `[data-label="Relationship"]`, fieldKey: "relationship" },
    { id: `[data-label="Same Residence"]`, fieldKey: "sameAddress" },
    { id: `[data-label="Work in Region"]`, fieldKey: "workInRegion" },
  ]
    .filter(({ id }) => !fieldsToSkip.includes(id))
    .forEach(({ id, fieldKey }) => {
      cy.get(id).contains(application[fieldKey])
    })
})

Cypress.Commands.add("verifyHouseholdDetails", (application, fieldsToSkip = []) => {
  const fields = [
    { id: "preferredUnitSizes", fieldKey: "preferredUnitSize" },
    { id: "adaPriorities", fieldKey: "adaPriorities" },
    { id: "expectingChanges", fieldKey: "householdExpectingChanges" },
    { id: "householdStudent", fieldKey: "householdStudent" },
  ]
  verifyHelper(application, fields, fieldsToSkip)
})

Cypress.Commands.add("verifyHouseholdIncome", (application, fieldsToSkip = []) => {
  const fields = [
    { id: "annualIncome", fieldKey: "annualIncome" },
    { id: "monthlyIncome", fieldKey: "formattedMonthlyIncome" },
    { id: "vouchers", fieldKey: "incomeVouchers" },
  ]
  verifyHelper(application, fields, fieldsToSkip)
})

Cypress.Commands.add("verifyTerms", (application) => {
  cy.getByTestId("signatureOnTerms").contains(application["acceptedTerms"])
})

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
  return cy.get(`[id="${CSS.escape(id)}"]`, ...args)
})

Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add("loginAndAcceptTerms", (fix = "user") => {
  cy.visit("/")
  cy.fixture(fix).then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get("button").contains("Sign In").click()
    cy.getByTestId("agree").check()
    cy.getByID("form-submit").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("login", (fix = "user") => {
  cy.visit("/")
  cy.fixture(fix).then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get("button").contains("Sign In").click()
    cy.contains("Listings")
  })
})

Cypress.Commands.add("loginWithMfa", () => {
  cy.visit("/")
  cy.fixture("mfaUser").then((user) => {
    cy.get("input#email").type(user.email)
    cy.get("input#password").type(user.password)
    cy.get("button").contains("Sign In").click()
    cy.getByID("verify-by-email").click()
    cy.getByTestId("sign-in-mfa-code-field").type(user.mfaCode)
    cy.getByID("verify-and-sign-in").click()
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

const processSet = (obj, set, fieldsToSkip, command) => {
  if (set.length) {
    set.forEach(({ id, fieldKey }) => {
      if (!fieldsToSkip.includes(id)) {
        if (command === "type") {
          cy.getByID(id).type(obj[fieldKey])
        } else if (command === "select") {
          cy.getByID(id).select(obj[fieldKey])
        } else if (command === "click") {
          cy.getByID(fieldKey).click()
        }
      }
    })
  }
}

const fillFields = (obj, fieldsToType, fieldsToSelect, fieldsToClick, fieldsToSkip) => {
  processSet(obj, fieldsToType, fieldsToSkip, "type")
  processSet(obj, fieldsToSelect, fieldsToSkip, "select")
  processSet(obj, fieldsToClick, fieldsToSkip, "click")
}

Cypress.Commands.add(
  "fillFields",
  (obj, fieldsToType, fieldsToSelect, fieldsToClick, fieldsToSkip) => {
    fillFields(obj, fieldsToType, fieldsToSelect, fieldsToClick, fieldsToSkip)
  }
)

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
    { id: "application.applicant.applicantAddress.street", fieldKey: "applicant.address.street" },
    { id: "application.applicant.applicantAddress.street2", fieldKey: "applicant.address.street2" },
    { id: "application.applicant.applicantAddress.city", fieldKey: "applicant.address.city" },
    { id: "application.applicant.applicantAddress.zipCode", fieldKey: "applicant.address.zipCode" },
  ]

  const fieldsToSelect = [
    { id: "application.language", fieldKey: "language" },
    { id: "application.applicant.phoneNumberType", fieldKey: "applicant.phoneNumberType" },
    { id: "application.additionalPhoneNumberType", fieldKey: "additionalPhoneNumberType" },
    { id: "application.applicant.applicantAddress.state", fieldKey: "applicant.address.state" },
  ]

  const fieldsToClick = [{ id: "email", fieldKey: "email" }]

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
      id: "application.alternateContact.address.street",
      fieldKey: "alternateContact.mailingAddress.street",
    },
    {
      id: "application.alternateContact.address.street2",
      fieldKey: "alternateContact.mailingAddress.street2",
    },
    {
      id: "application.alternateContact.address.city",
      fieldKey: "alternateContact.mailingAddress.city",
    },
    {
      id: "application.alternateContact.address.zipCode",
      fieldKey: "alternateContact.mailingAddress.zipCode",
    },
  ]

  const fieldsToSelect = [
    { id: "application.alternateContact.type", fieldKey: "alternateContact.type" },
    {
      id: "application.alternateContact.address.state",
      fieldKey: "alternateContact.mailingAddress.state",
    },
  ]

  fillFields(application, fieldsToType, fieldsToSelect, [], fieldsToSkip)
})

Cypress.Commands.add("fillHouseholdMember", (application, fieldsToSkip = []) => {
  cy.getByID("addHouseholdMemberButton").click()

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

  cy.getByID("submitAddMemberForm").click()
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
    cy.getByTestId("app-income-vouchers").parent().contains(application["incomeVouchers"]).click()
  }
})

Cypress.Commands.add("fillDemographics", (application, fieldsToSkip = []) => {
  if (!fieldsToSkip.includes("application.demographics.spokenLanguage")) {
    cy.getByID("application.demographics.spokenLanguage").select(
      application["demographics.spokenLanguage"]
    )
  }
  if (!fieldsToSkip.includes("indigenous")) {
    cy.getByID("indigenous").click()
  }
  if (!fieldsToSkip.includes("governmentWebsite")) {
    cy.getByID("governmentWebsite").click()
  }
})

Cypress.Commands.add("fillMailingAddress", (application, fieldsToSkip = []) => {
  cy.getByID("application.sendMailToMailingAddress").click()

  const fieldsToType = [
    { id: "application.applicationsMailingAddress.street", fieldKey: "mailingAddress.street" },
    { id: "application.applicationsMailingAddress.street2", fieldKey: "mailingAddress.street2" },
    { id: "application.applicationsMailingAddress.city", fieldKey: "mailingAddress.city" },
    { id: "application.applicationsMailingAddress.zipCode", fieldKey: "mailingAddress.zipCode" },
  ]

  const fieldsToSelect = [
    { id: "application.applicationsMailingAddress.state", fieldKey: "mailingAddress.state" },
  ]

  fillFields(application, fieldsToType, fieldsToSelect, [], fieldsToSkip)
})

Cypress.Commands.add("fillTerms", (application, submit) => {
  cy.getByID(`application.acceptedTerms${application["acceptedTerms"]}`).click()
  if (submit) {
    cy.getByID("submitApplicationButton").click()
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
    { id: "receivedDate", fieldKey: "receivedDate" },
    { id: "receivedTime", fieldKey: "receivedTime" },
    { id: "receivedBy", fieldKey: "receivedBy" },
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

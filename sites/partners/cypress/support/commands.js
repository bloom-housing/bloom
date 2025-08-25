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

// Authenticate via api for tests not explicitly testing login functionality
Cypress.Commands.add("loginApi", (fix = "user") => {
  cy.fixture(fix).then((user) => {
    cy.request("POST", "/api/adapter/auth/login", {
      email: user.email,
      password: user.password,
    }).then((response) => {
      expect(response.status).eq(201)
      expect(response).to.have.property("headers")
      cy.getCookie("access-token").should("exist")
    })
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

Cypress.Commands.add("signOutApi", (fix = "user") => {
  cy.fixture(fix).then((user) => {
    cy.request("GET", "/api/adapter/auth/logout").then((response) => {
      expect(response.status).eq(200)
    })
  })
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

  fillFields(application, fieldsToType, fieldsToSelect, [], fieldsToSkip)
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

Cypress.Commands.add("addMinimalListing", (listingName, isLottery, isApproval, jurisdiction) => {
  // Create and publish minimal FCFS or Lottery listing
  // TODO: test Open Waitlist, though maybe with integration test instead
  cy.getByID("addListingButton").contains("Add Listing").click()
  cy.contains("New Listing")
  cy.fixture("minimalListing").then((listing) => {
    if (jurisdiction) {
      cy.getByID("jurisdictions.id").select("Bay Area")
      cy.getByID("jurisdictions.id-error").should("not.include.text", "This field is required")
    }
    cy.getByID("name").type(listingName)
    cy.getByID("developer").type(listing["developer"])
    cy.getByID("add-photos-button").contains("Add Photo").click()
    cy.intercept("/api/adapter/upload", {
      body: {
        id: "123",
        url: "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg",
      },
    })
    cy.getByTestId("dropzone-input").attachFile(
      "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg",
      {
        subjectType: "drag-n-drop",
      }
    )
    cy.getByTestId("drawer-photos-table")
      .find("img")
      .should("have.attr", "src")
      .should(
        "include",
        "https://assets.website-files.com/5fbfdd121e108ea418ede824/5fbfdea9a7287d45a63d821b_Exygy%20Logo.svg"
      )
    cy.getByID("listing-photo-uploaded").contains("Save").click()
    cy.getByID("listingsBuildingAddress.street").type(listing["buildingAddress.street"])
    cy.getByID("neighborhood").type(listing["neighborhood"])
    cy.getByID("listingsBuildingAddress.city").type(listing["buildingAddress.city"])
    cy.getByID("listingsBuildingAddress.state").select(listing["buildingAddress.state"])
    cy.getByID("listingsBuildingAddress.zipCode").type(listing["buildingAddress.zipCode"])
    cy.getByID("addUnitsButton").contains("Add Unit").click()
    cy.getByID("number").type(listing["number"])
    cy.getByID("unitTypes.id").select(listing["unitType.id"])
    cy.getByID("amiChart.id").select(1).trigger("change")
    cy.getByID("amiPercentage").select(1)
    cy.getByID("unitFormSaveAndExitButton").contains("Save & Exit").click()
    cy.get("button").contains("Application Process").click()
    if (isLottery) {
      cy.getByID("reviewOrderLottery").check()
      cy.getByTestId("lottery-start-date-month").type("1")
      cy.getByTestId("lottery-start-date-day").type("17")
      cy.getByTestId("lottery-start-date-year").type("2026")
      cy.getByTestId("lottery-start-time-hours").type("9")
      cy.getByTestId("lottery-start-time-minutes").type("00")
      cy.getByTestId("lottery-start-time-period").select("AM")
      cy.getByTestId("lottery-end-time-hours").type("10")
      cy.getByTestId("lottery-end-time-minutes").type("00")
      cy.getByTestId("lottery-end-time-period").select("AM")
    }
    cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
    cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
    cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
    cy.getByID("digitalApplicationChoiceYes").check()
    cy.getByID("commonDigitalApplicationChoiceYes").check()
    cy.getByID("paperApplicationNo").check()
    cy.getByID("applicationDueDateField.month").type(listing["date.month"])
    cy.getByID("applicationDueDateField.day").type(listing["date.day"])
    cy.getByID("applicationDueDateField.year").type((new Date().getFullYear() + 1).toString())
    cy.getByID("applicationDueTimeField.hours").type(listing["date.hours"])
    cy.getByID("applicationDueTimeField.minutes").type(listing["date.minutes"])
    cy.getByID("applicationDueTimeField.period").select("PM")
  })

  if (isApproval) {
    cy.getByID("submitButton").contains("Submit").click()
    cy.getByID("submitListingForApprovalButtonConfirm").contains("Submit").click()
    cy.getByTestId("page-header").should("be.visible")
    cy.getByTestId("page-header").should("have.text", listingName)
  } else {
    cy.getByID("publishButton").contains("Publish").click()
    cy.getByID("publishButtonConfirm").contains("Publish").click()
    cy.get("[data-testid=page-header]").should("be.visible")
    cy.getByTestId("page-header").should("have.text", listingName)
  }
})

Cypress.Commands.add("addMinimalApplication", (listingName) => {
  cy.visit("/")
  cy.contains("Users")
  cy.getByTestId(`listing-status-cell-${listingName}`).click()
  cy.getByID("addApplicationButton").contains("Add Application").click()
  cy.fixture("applicantOnlyData").then((application) => {
    cy.fillPrimaryApplicant(application, [
      "application.additionalPhoneNumber",
      "application.additionalPhoneNumberType",
      "application.applicant.address.street2",
    ])
  })
  cy.getByID("submitApplicationButton").click()
})

Cypress.Commands.add("findAndOpenListing", (listingName) => {
  cy.visit("/")
  cy.contains("Listings")
  cy.getByTestId("ag-search-input").should("be.visible").type(listingName, { force: true })
  cy.getByTestId(listingName).first().click()
})

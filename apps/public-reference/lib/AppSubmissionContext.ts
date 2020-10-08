import React from "react"
import ApplicationConductor from "./ApplicationConductor"

export const retrieveApplicationConfig = () => {
  // Note: this whole function will eventually be replaced with one that reads this from the backend.
  return {
    sections: ["You", "Household", "Income", "Preferences", "Review"],
    languages: ["en", "zh"],
    steps: [
      {
        name: "chooseLanguage",
      },
      {
        name: "whatToExpect",
      },
      {
        name: "primaryApplicantName",
      },
      {
        name: "primaryApplicantAddress",
      },
      {
        name: "alternateContactType",
      },
      {
        name: "alternateContactName",
      },
      {
        name: "alternateContactInfo",
      },
      {
        name: "liveAlone",
      },
      {
        name: "householdMemberInfo",
      },
      {
        name: "addMembers",
      },
      {
        name: "preferredUnitSize",
      },
      {
        name: "adaHouseholdMembers",
      },
      {
        name: "vouchersSubsidies",
      },
      {
        name: "income",
      },
      {
        name: "preferencesIntroduction",
      },
      {
        name: "generalPool",
      },
      {
        name: "demographics",
      },
      {
        name: "summary",
      },
      {
        name: "terms",
      },
    ],
  }
}

export const blankApplication = () => {
  return {
    loaded: false,
    completedSections: 0,
    applicant: {
      firstName: "",
      middleName: "",
      lastName: "",
      birthMonth: 0,
      birthDay: 0,
      birthYear: 0,
      emailAddress: "",
      noEmail: false,
      phoneNumber: "",
      phoneNumberType: "",
      noPhone: false,
      workInRegion: null,
      address: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
        county: "",
        latitude: null,
        longitude: null,
      },
      workAddress: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
        county: "",
        latitude: null,
        longitude: null,
      },
    },
    additionalPhone: false,
    additionalPhoneNumber: "",
    additionalPhoneNumberType: "",
    contactPreferences: [],
    householdSize: 0,
    housingStatus: "",
    sendMailToMailingAddress: false,
    mailingAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    alternateAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    alternateContact: {
      type: "",
      otherType: "",
      firstName: "",
      lastName: "",
      agency: "",
      phoneNumber: "",
      emailAddress: "",
      mailingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    accessibility: {
      mobility: null,
      vision: null,
      hearing: null,
    },
    incomeVouchers: null,
    income: null,
    incomePeriod: null,
    householdMembers: [],
    preferredUnit: [],
    demographics: {
      ethnicity: "",
      gender: "",
      sexualOrientation: "",
      howDidYouHear: "",
    },
    preferences: {} as Record<string, any>,
    confirmationId: "",
  }
}

export const AppSubmissionContext = React.createContext({
  conductor: {} as ApplicationConductor,
  application: blankApplication(),
  listing: null,
  /* eslint-disable */
  syncApplication: (data) => { },
  syncListing: (data) => { },
})

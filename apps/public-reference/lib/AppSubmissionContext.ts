import React from "react"
import ApplicationConductor from "./ApplicationConductor"

export function applicationConfig() {
  // Note: this whole function will eventually be replaced with one that reads this from the backend.
  return {
    listing: {}, // TODO: actual listing object
    status: "TODO: ENUM GOES HERE",
    languages: ["en", "es"],
    steps: [
      {
        name: "Choose Language", // not user-facing, only shows in partners; user text from the step itself
        url: "/applications/start/choose-language",
        skipIf: { condition: "userIsLoggedIn()", skipTo: "/applications/start/what-to-expect" },
        nextUrl: "/applications/start/what-to-expect",
      },
      {
        name: "What To Expect",
        url: "/applications/start/what-to-expect",
        nextUrl: "/applications/contact/name",
      },
      {
        name: "Primary Applicant Name",
        url: "/applications/contact/name",
        nextUrl: "/applications/start/address",
      },
      // [...]
      {
        name: "Senior Building Preference",
        url: "/applications/preferences/senior",
        props: { minAge: 65 },
        // this isn't conditional because the config object is on a per-listing basis
        nextUrl: "/applications/preferences/livework",
      },
      {
        name: "Live/Work Preference",
        url: "/applications/preferences/livework",
        skipIf: {
          condition: "application.applicant.address.city != 'Correctville'",
          skipTo: "/applications/start/what-to-expect",
        },
        nextUrl: "/applications/start/what-to-expect",
      },
    ],
  }
}

export const blankApplication = () => {
  return {
    loaded: false,
    completedStep: 0,
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
  }
}

export const AppSubmissionContext = React.createContext({
  conductor: {} as ApplicationConductor,
  application: blankApplication(),
  listing: null,
  /* eslint-disable */
  syncApplication: (data) => {},
  syncListing: (data) => {},
})

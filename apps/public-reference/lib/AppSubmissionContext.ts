import React from "react"

export const blankApplication = () => {
  return {
    loaded: false,
    completedStep: 0,
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
    additionalPhone: false,
    additionalPhoneNumber: "",
    additionalPhoneNumberType: "",
    workInRegion: null,
    housingStatus: "",
    address: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipcode: "",
    },
    sendMailToMailingAddress: false,
    mailingAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipcode: "",
    },
    workAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipcode: "",
    },
    alternateAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipcode: "",
    },
    householdSize: 0,
  }
}

export const AppSubmissionContext = React.createContext({
  application: blankApplication(),
  /* eslint-disable */
  syncApplication: (data) => {},
})

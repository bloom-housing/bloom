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
    age: null,
    liveInSF: null,
    housingStatus: "",
    address: {
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
  }
}

export const AppSubmissionContext = React.createContext({
  application: blankApplication(),
  /* eslint-disable */
  syncApplication: (data) => {},
})

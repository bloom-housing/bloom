import React from "react"

export const blankApplication = () => {
  return {
    loaded: false,
    completedStep: 0,
    name: "",
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
  }
}

export const AppSubmissionContext = React.createContext({
  application: blankApplication(),
  /* eslint-disable */
  syncApplication: data => {}
})

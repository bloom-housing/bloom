const applicationKeysToStripOnAutofill = ["completedSections"]

const stripPreferences = (application) => {
  return application
}

const stripLiveWorkAddresses = (application) => {
  return application
}

const cleanUpApplicationForAutofill = (application) => {
  // First, strip out all the obvious keys we don't want to use for autofill
  const newApplication = Object.fromEntries(
    Object.entries(application).filter(([key]) => !applicationKeysToStripOnAutofill.includes(key))
  )

  // Now handle any special cases
  stripPreferences(application)
  stripLiveWorkAddresses(application)

  return newApplication
}

export default cleanUpApplicationForAutofill

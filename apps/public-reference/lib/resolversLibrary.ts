const requiresLoginResolver = (applicationContext, userContext) => {
  return () => {
    return !userContext.profile
  }
}

const noAlternateContactResolver = (applicationContext) => {
  return () => {
    return applicationContext.application.alternateContact.type == "noContact"
  }
}

const soloHousehold = (applicationContext) => {
  return () => {
    return applicationContext.application.householdSize == 1
  }
}

const preferencesSelected = (applicationContext) => {
  return () => {
    return !applicationContext.application.preferences.none
  }
}

export const resolversLibrary = (applicationContext, userContext) => {
  return {
    requiresLogin: requiresLoginResolver(applicationContext, userContext),
    noAlternateContact: noAlternateContactResolver(applicationContext),
    soloHousehold: soloHousehold(applicationContext),
    preferencesSelected: preferencesSelected(applicationContext),
  }
}

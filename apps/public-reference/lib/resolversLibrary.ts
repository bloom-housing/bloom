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
    // console.info("size!", applicationContext.application.householdSize)
    return applicationContext.application.householdSize == 1
  }
}

export const resolversLibrary = (applicationContext, userContext) => {
  return {
    requiresLogin: requiresLoginResolver(applicationContext, userContext),
    noAlternateContact: noAlternateContactResolver(applicationContext),
    soloHousehold: soloHousehold(applicationContext),
  }
}

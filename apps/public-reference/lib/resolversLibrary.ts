const requiresLoginResolver = (applicationContext, userContext) => {
  return () => {
    return !userContext.profile
  }
}

const noAlternateContactResolver = (applicationContext) => {
  return () => {
    applicationContext.application.alternateContact.type == "noContact"
  }
}

export const resolversLibrary = (applicationContext, userContext) => {
  return {
    requiresLogin: requiresLoginResolver(applicationContext, userContext),
    noAlternateContact: noAlternateContactResolver(applicationContext),
  }
}

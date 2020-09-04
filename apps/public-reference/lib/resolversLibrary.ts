const requiresLoginResolver = (applicationContext, userContext) => {
  return () => {
    return !userContext.profile
  }
}

export const resolversLibrary = (applicationContext, userContext) => {
  return {
    requiresLogin: requiresLoginResolver(applicationContext, userContext),
  }
}

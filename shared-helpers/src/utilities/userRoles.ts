import { UserRole } from "../types/backend-swagger"

export const isAdminRole = (userRoles: UserRole) => {
  return userRoles?.isAdmin || userRoles?.isSuperAdmin || userRoles?.isSupportAdmin
}

export const isPartnerPortalRole = (userRoles: UserRole) => {
  return (
    isAdminRole(userRoles) ||
    userRoles?.isJurisdictionalAdmin ||
    userRoles?.isLimitedJurisdictionalAdmin ||
    userRoles?.isPartner
  )
}

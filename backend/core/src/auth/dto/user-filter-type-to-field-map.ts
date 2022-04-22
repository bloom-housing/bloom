import { UserFilterKeys } from "../types/user-filter-keys"

export const userFilterTypeToFieldMap: Record<keyof typeof UserFilterKeys, string> = {
  isPartner: "userRoles.isPartner",
  isPortalUser: "userRoles",
}

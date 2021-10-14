import { UserFilterKeys } from "../types/user-filter-keys"

export const userFilterTypeToFieldMap: Record<keyof typeof UserFilterKeys, string> = {
  isPartner: "user_roles.isPartner",
}

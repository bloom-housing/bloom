import { ProgramFilterKeys } from "./program-filter-keys"

export const jurisdictionFilterTypeToFieldMap: Record<ProgramFilterKeys, string> = {
  jurisdiction: "preferenceJurisdictions.id",
}

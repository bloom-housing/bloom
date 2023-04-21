import { CombinedListingFilterKeys } from "./combined-listing-filter-keys-enum"

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
export const combinedListingFilterTypeToFieldMap: Record<
  keyof typeof CombinedListingFilterKeys,
  string
> = {
  status: "status",
  name: "name",
  neighborhood: "neighborhood",
  bedrooms: "units->>'num_bedrooms'",
  zipcode: "building_address->>'zip_code'",
  leasingAgents: "leasing_agents->>'id'",
  jurisdiction: "jurisdiction->>'id'",
  isExternal: "is_external",
}

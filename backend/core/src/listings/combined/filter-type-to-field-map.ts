import {
  CombinedListingFilterKeys,
  CombinedListingUnitFilterKeys,
} from "./combined-listing-filter-keys-enum"

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
export const combinedListingFilterTypeToFieldMap: Record<
  keyof typeof CombinedListingFilterKeys,
  string
> = {
  status: "status",
  name: "name",
  neighborhood: "neighborhood",
  bedrooms: "bedrooms", // unused, but necessary to include
  zipcode: "building_address->>'zip_code'",
  leasingAgents: "leasing_agents->>'id'",
  jurisdiction: "jurisdiction->>'id'",
  isExternal: "is_external",
  counties: "building_address->>'county'",
  city: "building_address->>'city'",
}

export const combinedListingUnitFilterTypeToFieldMap: Record<
  keyof typeof CombinedListingUnitFilterKeys,
  string
> = {
  numBedrooms: "numBedrooms",
  numBathrooms: "numBathrooms",
  monthlyRent: "numMonthlyRent", // use the numeric field
}

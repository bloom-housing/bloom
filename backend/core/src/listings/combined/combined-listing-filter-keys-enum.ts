/*
  It isn't possible to assign enum values based on another enum 
  (ie status = ListingFilterKeys.status) with the current version of typescript,
  so we have to assign them manually and maintain them in two places.  It's not
  expected that these values will change in the future, so it probably isn't a
  big deal, but it's worth noting until TS gets upgraded.

  "error TS2553: Computed values are not permitted in an enum with string valued members"

  REMOVE_WHEN_EXTERNAL_NOT_NEEDED
*/
export enum CombinedListingFilterKeys {
  // From ListingFilterKeys
  status = "status",
  name = "name",
  neighborhood = "neighborhood",
  bedrooms = "bedrooms",
  zipcode = "zipcode",
  leasingAgents = "leasingAgents",
  jurisdiction = "jurisdiction",

  // Specific to combined listings
  isExternal = "isExternal",
  //monthlyRent = "monthlyRent", // placeholder
  county = "county",
  city = "city",
}

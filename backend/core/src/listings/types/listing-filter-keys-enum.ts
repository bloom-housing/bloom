// The names of supported filters on /listings
export enum ListingFilterKeys {
  status = "status",
  name = "name",
  neighborhood = "neighborhood",
  bedrooms = "bedrooms",
  zipcode = "zipcode",
  availability = "availability",
  seniorHousing = "seniorHousing",
  minRent = "minRent",
  maxRent = "maxRent",
  leasingAgents = "leasingAgents",
}

export enum AvailabilityFilterEnum {
  hasAvailability = "hasAvailability",
  noAvailability = "noAvailability",
  waitlist = "waitlist",
}

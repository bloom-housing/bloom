// The names of supported filters on /listings
export enum ListingFilterKeys {
  status = "status",
  name = "name",
  bedrooms = "bedrooms",
  zipcode = "zipcode",
  availability = "availability",
  seniorHousing = "seniorHousing",
  minRent = "minRent",
  maxRent = "maxRent",
  ami = "ami",
  leasingAgents = "leasingAgents",
}

export enum AvailabilityFilterEnum {
  hasAvailability = "hasAvailability",
  noAvailability = "noAvailability",
  waitlist = "waitlist",
}

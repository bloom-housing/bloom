// Using a record lets us enforce that all types are handled in addFilter
import { ListingFilterKeys } from "../../.."

/**
 * Fields for the Availability and AMI filters are determined based on the value
 * of the filter or by checking multiple columns. Since we can't specify a single
 * field the filters correspond to, we remove them from the filterTypeToFieldMap.
 */
type keysWithMappedField = Exclude<
  keyof typeof ListingFilterKeys,
  "minAmiPercentage" | "availability"
>

export const filterTypeToFieldMap: Record<keysWithMappedField, string> = {
  id: "listings.id",
  status: "listings.status",
  name: "listings.name",
  isVerified: "listings.isVerified",
  bedrooms: "summaryUnitType.num_bedrooms",
  zipcode: "buildingAddress.zipCode",
  leasingAgents: "leasingAgents.id",
  program: "listingsProgramsProgram.title",
  // This is the inverse of the explanation for maxRent below.
  minRent: "amilevels.flat_rent_value",
  /**
   * The maxRent filter uses the monthly_rent_min field to avoid missing units
   * in the unitGroups's rent range. For example, if there's a unitGroups with
   * monthly_rent_min of $300 and monthly_rent_max of $800, we could have a
   * real unit with rent $500, which would look like:
   *
   * $300 ---------------- $500 ------ $600 ----------- $800
   * ^                     ^           ^                ^
   * ^                     ^           ^                ^
   * |                     |           |                unitGroups.monthly_rent_max
   * |                     |           maxRent filter value
   * |                     actual unit's rent
   * unitGroups.monthly_rent_min
   *
   * If a user sets the maxRent filter to $600 we should show this potential unit.
   * To make sure we show this potential unit in results, we want to search for
   * listings with a monthly_rent_min that's <= $600. If we used the
   * monthly_rent_max field, we'd miss it.
   */
  maxRent: "amilevels.flat_rent_value",
  elevator: "listing_features.elevator",
  wheelchairRamp: "listing_features.wheelchairRamp",
  serviceAnimalsAllowed: "listing_features.serviceAnimalsAllowed",
  accessibleParking: "listing_features.accessibleParking",
  parkingOnSite: "listing_features.parkingOnSite",
  inUnitWasherDryer: "listing_features.inUnitWasherDryer",
  laundryInBuilding: "listing_features.laundryInBuilding",
  barrierFreeEntrance: "listing_features.barrierFreeEntrance",
  rollInShower: "listing_features.rollInShower",
  grabBars: "listing_features.grabBars",
  heatingInUnit: "listing_features.heatingInUnit",
  acInUnit: "listing_features.acInUnit",
  jurisdiction: "jurisdiction.id",
  favorited: "",
  marketingType: "listings.marketingType",
  region: "property.region",
  hearing: "",
  mobility: "",
  visual: "",
  vacantUnits: "",
  openWaitlist: "",
  closedWaitlist: "",
  Families: "",
  ResidentswithDisabilities: "",
  Seniors55: "",
  Seniors62: "",
  SupportiveHousingfortheHomeless: "",
  Veterans: "",
  bedRoomSize: "",
  communityPrograms: "",
  accessibility: "",
}

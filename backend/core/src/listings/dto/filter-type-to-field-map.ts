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
  status: "listings.status",
  name: "listings.name",
  bedrooms: "summaryUnitType.num_bedrooms",
  zipcode: "buildingAddress.zipCode",
  leasingAgents: "leasingAgents.id",
  seniorHousing: "reservedCommunityType.name",
  independentLivingHousing: "reservedCommunityType.name",
  // This is the inverse of the explanation for maxRent below.
  minRent: "unitsSummary.monthly_rent_max",
  /**
   * The maxRent filter uses the monthly_rent_min field to avoid missing units
   * in the unitsSummary's rent range. For example, if there's a unitsSummary with
   * monthly_rent_min of $300 and monthly_rent_max of $800, we could have a
   * real unit with rent $500, which would look like:
   *
   * $300 ---------------- $500 ------ $600 ----------- $800
   * ^                     ^           ^                ^
   * ^                     ^           ^                ^
   * |                     |           |                unitsSummary.monthly_rent_max
   * |                     |           maxRent filter value
   * |                     actual unit's rent
   * unitsSummary.monthly_rent_min
   *
   * If a user sets the maxRent filter to $600 we should show this potential unit.
   * To make sure we show this potential unit in results, we want to search for
   * listings with a monthly_rent_min that's <= $600. If we used the
   * monthly_rent_max field, we'd miss it.
   */
  maxRent: "unitsSummary.monthly_rent_min",
  elevator: "features.elevator",
  wheelchairRamp: "features.wheelchairRamp",
  serviceAnimalsAllowed: "features.serviceAnimalsAllowed",
  accessibleParking: "features.accessibleParking",
  parkingOnSite: "features.parkingOnSite",
  inUnitWasherDryer: "features.inUnitWasherDryer",
  laundryInBuilding: "features.laundryInBuilding",
  barrierFreeEntrance: "features.barrierFreeEntrance",
  rollInShower: "features.rollInShower",
  grabBars: "features.grabBars",
  heatingInUnit: "features.heatingInUnit",
  acInUnit: "features.acInUnit",
  neighborhood: "property.neighborhood",
}

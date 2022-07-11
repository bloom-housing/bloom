// Using a record lets us enforce that all types are handled in addFilter
import { ListingFilterKeys } from "../../.."

export const filterTypeToFieldMap: Record<keyof typeof ListingFilterKeys, string> = {
  status: "listings.status",
  name: "listings.name",
  neighborhood: "listings.neighborhood",
  bedrooms: "unitTypeRef.num_bedrooms",
  zipcode: "buildingAddress.zipCode",
  leasingAgents: "leasingAgents.id",
  jurisdiction: "jurisdiction.id",
}

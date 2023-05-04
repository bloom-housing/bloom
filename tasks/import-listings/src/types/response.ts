import { Listing } from "./listing"
import { Jurisdiction } from "./jurisdiction"

export class JurisdictionResponse {
  data: Jurisdiction[]
}

export class ListingResponse {
  items: Listing[]
  meta: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

import { Listing } from "../entity/listing.entity"
import { ListingsResponseStatus } from "./listings.service"

export class ListingsListResponse {
  status: ListingsResponseStatus
  listings: Listing[]
  amiCharts: any
}

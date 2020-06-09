import { ListingEntity } from "../entity/listing.entity"
import { ListingsResponseStatus } from "./listings.service"

export class ListingsFindAllQueryParams {
  jsonpath?: string
}

export class ListingsFindAllResponse {
  status: ListingsResponseStatus
  listings: ListingEntity[]
  amiCharts: any
}

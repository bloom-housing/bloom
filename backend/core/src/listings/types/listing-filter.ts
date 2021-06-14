import { Operators } from "../../shared/filter"
import { ListingStatus } from "./listing-status-enum"

export interface ListingFilter {
  status?: {
    [operator in Operators]?: ListingStatus
  }
}

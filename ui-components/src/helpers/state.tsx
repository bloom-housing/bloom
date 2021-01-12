import moment from "moment"
import { Listing } from "@bloom-housing/backend-core/types"

export const openDateState = (listing: Listing) => {
  const nowTime = moment()
  return listing.applicationOpenDate && nowTime < moment(listing.applicationOpenDate)
}

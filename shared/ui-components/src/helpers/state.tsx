import moment from "moment"
import { ListingDto } from "@bloom-housing/core"

export const openDateState = (listing: ListingDto) => {
  const nowTime = moment()
  return (
    (listing.applicationOpenDate && nowTime < moment(listing.applicationOpenDate)) ||
    listing.applicationDueDate == ""
  )
}

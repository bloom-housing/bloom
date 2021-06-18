import dayjs from "dayjs"
import { Listing } from "@bloom-housing/backend-core/types"

export const openDateState = (listing: Listing) => {
  const nowTime = dayjs()
  return listing.applicationOpenDate && nowTime < dayjs(listing.applicationOpenDate)
}

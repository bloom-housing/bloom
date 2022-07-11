import { Listing, ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"

export const getLotteryEvent = (listing: Listing): ListingEvent | undefined => {
  return listing?.events.find(
    (event) => event.type === ListingEventType.publicLottery && event.startTime
  )
}

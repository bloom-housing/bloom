import { Listing, ListingEvent, ListingEventsTypeEnum } from "../types/backend-swagger"

export const getLotteryEvent = (listing: Listing): ListingEvent | undefined => {
  return listing?.listingEvents?.find(
    (event) => event.type === ListingEventsTypeEnum.publicLottery && event.startDate
  )
}

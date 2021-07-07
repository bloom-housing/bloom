import { FormListing } from "./PaperListingForm/index"
import { ListingEventType } from "@bloom-housing/backend-core/types"

export const getLotteryEvent = (listing: FormListing) => {
  let lotteryEvent = null
  listing?.events.forEach((event) => {
    if (event.type === ListingEventType.publicLottery) {
      lotteryEvent = event
    }
  })
  return lotteryEvent
}

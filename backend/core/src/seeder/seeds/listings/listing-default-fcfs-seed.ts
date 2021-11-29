import { ListingDefaultSeed } from "./listing-default-seed"
import { ListingReviewOrder } from "../../../listings/types/listing-review-order-enum"

export class ListingDefaultFCFSSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, FCFS",
      reviewOrderType: "firstComeFirstServe" as ListingReviewOrder,
      applicationDueDate: null,
      events: [],
    })
  }
}

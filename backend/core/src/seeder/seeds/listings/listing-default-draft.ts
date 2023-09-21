import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultDraftSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Draft",
      status: ListingStatus.pending,
    })
  }
}

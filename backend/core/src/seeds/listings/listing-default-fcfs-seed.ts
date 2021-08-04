import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultFCFSSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, FCFS",
      applicationDueDate: null,
      events: [],
    })
  }
}

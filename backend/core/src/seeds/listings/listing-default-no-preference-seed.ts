import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultNoPreferenceSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, No Preferences",
      preferences: [],
    })
  }
}

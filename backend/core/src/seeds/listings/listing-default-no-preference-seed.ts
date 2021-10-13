import { ListingDefaultSeed } from "./listing-default-seed"
import { getDate } from "./shared"

export class ListingDefaultNoPreferenceSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, No Preferences",
      preferences: [],
      applicationDueDate: getDate(5),
      applicationOpenDate: getDate(-5),
    })
  }
}

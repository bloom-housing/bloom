import { ListingDefaultSeed } from "./listing-default-seed"
import { getDate } from "./shared"

export class ListingDefaultOpenSoonSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Open Soon",
      applicationOpenDate: getDate(30),
      applicationDueDate: getDate(60),
    })
  }
}

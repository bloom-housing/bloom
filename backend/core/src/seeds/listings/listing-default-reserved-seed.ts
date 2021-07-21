import { ReservedCommunityType } from "types"
import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultReservedSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Reserved",
      reservedCommunityDescription: "Custom reserved community type description",
    })
  }
}

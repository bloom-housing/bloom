import { ReservedCommunityType } from "types"
import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultReservedSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const reservedType = await this.reservedTypeRepository.findOneOrFail({ name: "senior62" })

    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Reserved",
      reservedCommunityDescription: "Custom reserved community type description",
      reservedCommunityType: reservedType,
    })
  }
}

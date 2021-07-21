import { getLiveWorkPreference } from "./shared"
import { ListingDefaultSeed } from "./listing-default-seed"
import { Preference } from "../../preferences/entities/preference.entity"

export class ListingDefaultOnePreferenceSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, One Preference",
      preferences: [getLiveWorkPreference() as Preference],
    })
  }
}

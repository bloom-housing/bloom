import { getLiveWorkPreference } from "./shared"
import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultOnePreferenceSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, One Preference",
      listingPreferences: [
        {
          preference: await this.preferencesRepository.findOneOrFail({
            title: getLiveWorkPreference().title,
          }),
          ordinal: 1,
          page: 1,
        },
      ],
    })
  }
}

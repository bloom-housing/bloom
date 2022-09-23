import { getLiveWorkPreference } from "./shared"
import { ListingDefaultSeed } from "./listing-default-seed"

export class ListingDefaultOnePreferenceSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, One Preference",
      listingMultiselectQuestions: [
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            text: getLiveWorkPreference(listing.jurisdiction.name).text,
          }),
          ordinal: 1,
          page: 1,
        },
      ],
    })
  }
}

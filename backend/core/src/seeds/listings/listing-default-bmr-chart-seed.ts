import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultUnits } from "./shared"

export class ListingDefaultBmrChartSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    const defaultUnits = getDefaultUnits()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, BMR Chart",
      preferences: [],
      units: [
        { ...defaultUnits[0], bmrProgramChart: true, monthlyIncomeMin: "700", monthlyRent: "350" },
        { ...defaultUnits[1], bmrProgramChart: true, monthlyIncomeMin: "800", monthlyRent: "400" },
      ],
    })
  }
}

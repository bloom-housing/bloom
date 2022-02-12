import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitsSummaryCreateDto } from "../../../units-summary/dto/units-summary.dto"

export class ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With 30 Listing With 10 Ami Percentage",
      amiPercentageMax: 10,
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const twoBdrm30AmiUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 8,
      listing: listing,
      amiPercentage: 30,
    }
    unitsSummaryToBeCreated.push(twoBdrm30AmiUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}

import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitsSummary } from "../../units-summary/entities/units-summary.entity"
import { DeepPartial } from "typeorm"
import { MonthlyRentDeterminationType } from "../../units-summary/types/monthly-rent-determination.enum"

export class ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With 10 Listing With 30 Ami Percentage",
      amiPercentageMax: 30
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitsSummaryToBeCreated: Array<DeepPartial<UnitsSummary>> = []

    const twoBdrm30AmiUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
      amiLevels: [{
        amiPercentage: 10,
        monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
        flatRentValue: 1000
      }]
    }
    unitsSummaryToBeCreated.push(twoBdrm30AmiUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}

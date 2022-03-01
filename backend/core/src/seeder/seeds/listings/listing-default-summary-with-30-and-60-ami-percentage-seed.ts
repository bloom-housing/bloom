import { ListingDefaultSeed } from "./listing-default-seed"
import { DeepPartial } from "typeorm"
import { UnitsSummary } from "../../../units-summary/entities/units-summary.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"

export class ListingDefaultSummaryWith30And60AmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With 30 and 60 Ami Percentage",
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitsSummaryToBeCreated: Array<DeepPartial<UnitsSummary>> = []

    const twoBdrm30AmiUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 1000,
        },
      ],
    }
    unitsSummaryToBeCreated.push(twoBdrm30AmiUnitsSummary)

    const twoBdrm60AmiUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
      amiLevels: [
        {
          amiPercentage: 60,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 1000,
        },
      ],
    }
    unitsSummaryToBeCreated.push(twoBdrm60AmiUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}

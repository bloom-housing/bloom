import { ListingDefaultSeed } from "./listing-default-seed"
import { DeepPartial } from "typeorm"
import { UnitsSummary } from "../../../units-summary/entities/units-summary.entity"

export class ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary Without And Listing With 20 Ami Percentage",
      amiPercentageMax: 20,
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitsSummaryToBeCreated: Array<DeepPartial<UnitsSummary>> = []

    const twoBdrm30AmiUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(twoBdrm30AmiUnitsSummary)

    const twoBdrm60AmiUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(twoBdrm60AmiUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}

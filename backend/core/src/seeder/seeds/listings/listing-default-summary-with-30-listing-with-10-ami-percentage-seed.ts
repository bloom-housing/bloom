import { ListingDefaultSeed } from "./listing-default-seed"
import { DeepPartial } from "typeorm"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"

export class ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With 30 Listing With 10 Ami Percentage",
      amiPercentageMax: 10,
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitGroupToBeCreated: Array<DeepPartial<UnitGroup>> = []

    const twoBdrm30AmiUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 1000,
        },
      ],
    }
    unitGroupToBeCreated.push(twoBdrm30AmiUnitGroup)

    await this.unitGroupRepository.save(unitGroupToBeCreated)

    return newListing
  }
}

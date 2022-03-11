import { ListingDefaultSeed } from "./listing-default-seed"
import { DeepPartial } from "typeorm"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"

export class ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary Without And Listing With 20 Ami Percentage",
      amiPercentageMax: 20,
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitGroupToBeCreated: Array<DeepPartial<UnitGroup>> = []

    const twoBdrm30AmiUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
    }
    unitGroupToBeCreated.push(twoBdrm30AmiUnitGroup)

    const twoBdrm60AmiUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 8,
      listing: listing,
    }
    unitGroupToBeCreated.push(twoBdrm60AmiUnitGroup)

    await this.unitGroupRepository.save(unitGroupToBeCreated)

    return newListing
  }
}

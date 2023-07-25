import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultUnits } from "./shared"
import { BaseEntity } from "typeorm"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultMultipleAMI extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "oneBdrm" },
    })

    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.bay_area },
    })
    const amiChartOne = await this.amiChartRepository.findOneOrFail({
      where: {
        name: "San Jose TCAC 2019",
        jurisdiction: {
          name: bayAreaJurisdiction.name,
        },
      },
    })
    const amiChartTwo = await this.amiChartRepository.findOneOrFail({
      where: {
        name: "AlamedaCountyTCAC2021",
        jurisdiction: {
          name: bayAreaJurisdiction.name,
        },
      },
    })

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Multiple AMI",
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = getDefaultUnits().map(
      (unit, index) => {
        return {
          ...unit,
          amiChart: index % 2 === 0 ? amiChartOne : amiChartTwo,
          listing: { id: newListing.id },
        }
      }
    )

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeOneBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return newListing
  }
}

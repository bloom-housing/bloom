import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultAmiChart, getDefaultUnits, getDefaultProperty } from "./shared"
import { tritonAmiChart } from "./listing-triton-seed"
import { BaseEntity } from "typeorm"
import { UnitCreateDto } from "../../units/dto/unit-create.dto"

export class ListingDefaultMultipleAMI extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const amiChartOne = await this.amiChartRepository.save(tritonAmiChart)
    const amiChartTwo = await this.amiChartRepository.save(getDefaultAmiChart())

    const property = await this.propertyRepository.save({
      ...getDefaultProperty(),
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = getDefaultUnits().map(
      (unit, index) => {
        return {
          ...unit,
          property: {
            id: property.id,
          },
          amiChart: index % 2 === 0 ? amiChartOne : amiChartTwo,
        }
      }
    )

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeOneBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return await this.listingRepository.save({
      ...listing,
      property: property,
      name: "Test: Default, Multiple AMI",
    })
  }
}

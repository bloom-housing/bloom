import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultUnits, getDefaultProperty, getDefaultAmiChart } from "./shared"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import { BaseEntity } from "typeorm"

export class ListingDefaultBmrChartSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    const defaultUnits = getDefaultUnits()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const amiChart = await this.amiChartRepository.save(getDefaultAmiChart())

    const property = await this.propertyRepository.save({
      ...getDefaultProperty(),
    })

    const bmrUnits = [
      { ...defaultUnits[0], bmrProgramChart: true, monthlyIncomeMin: "700", monthlyRent: "350" },
      { ...defaultUnits[1], bmrProgramChart: true, monthlyIncomeMin: "800", monthlyRent: "400" },
    ]

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = bmrUnits.map((unit) => {
      return {
        ...unit,
        property: {
          id: property.id,
        },
        amiChart,
      }
    })

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeTwoBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, BMR Chart",
      preferences: [],
      property,
    })
  }
}

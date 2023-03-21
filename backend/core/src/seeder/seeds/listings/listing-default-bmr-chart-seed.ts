import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultUnits, getTayProgram } from "./shared"
import { BaseEntity } from "typeorm"
import { defaultAmiChart } from "../ami-charts/default-ami-chart"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"
import { CountyCode } from "../../../shared/types/county-code"

export class ListingDefaultBmrChartSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    const defaultUnits = getDefaultUnits()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.bay_area,
    })
    const amiChart = await this.amiChartRepository.findOneOrFail({
      name: defaultAmiChart.name,
      jurisdiction: bayAreaJurisdiction,
    })

    const bmrUnits = [
      { ...defaultUnits[0], bmrProgramChart: true, monthlyIncomeMin: "700", monthlyRent: "350" },
      { ...defaultUnits[1], bmrProgramChart: true, monthlyIncomeMin: "800", monthlyRent: "400" },
    ]

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, BMR Chart",
      listingMultiselectQuestions: [
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            text: getTayProgram(bayAreaJurisdiction.name).text,
          }),
          ordinal: 1,
        },
      ],
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = bmrUnits.map((unit) => {
      return {
        ...unit,
        amiChart,
        listing: { id: newListing.id },
      }
    })

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeTwoBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return newListing
  }
}

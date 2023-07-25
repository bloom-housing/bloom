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

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "oneBdrm" },
    })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "twoBdrm" },
    })

    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.bay_area },
    })
    const amiChart = await this.amiChartRepository.findOneOrFail({
      where: {
        name: defaultAmiChart.name,
        jurisdiction: {
          name: bayAreaJurisdiction.name,
        },
      },
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
            where: { text: getTayProgram(bayAreaJurisdiction.name).text },
          }),
          ordinal: 1,
        },
      ],
      images: [
        {
          image: {
            label: "building",
            fileId:
              "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/house_goo3cp.jpg",
          },
        },
        {
          image: {
            label: "building",
            fileId:
              "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
          },
        },
        {
          image: {
            label: "building",
            fileId:
              "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/oakhouse_cgdqmx.jpg",
          },
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

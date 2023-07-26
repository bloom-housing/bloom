import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity } from "typeorm"
import { UnitSeedType } from "./listings"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultMultipleAMIAndPercentages extends ListingDefaultSeed {
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

    const multipleAMIUnits: Array<UnitSeedType> = [
      {
        amiChart: amiChartOne,
        amiPercentage: "30",
        annualIncomeMax: "45600",
        annualIncomeMin: "36168",
        bmrProgramChart: false,
        floor: 1,
        maxOccupancy: 3,
        minOccupancy: 1,
        monthlyIncomeMin: "3014",
        monthlyRent: "1219",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: 1,
        numBedrooms: 1,
        number: null,
        sqFeet: "635",
      },
      {
        amiChart: amiChartTwo,
        amiPercentage: "30",
        annualIncomeMax: "45600",
        annualIncomeMin: "36168",
        bmrProgramChart: false,
        floor: 1,
        maxOccupancy: 3,
        minOccupancy: 1,
        monthlyIncomeMin: "3014",
        monthlyRent: "1219",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: 1,
        numBedrooms: 1,
        number: null,
        sqFeet: "635",
      },
      {
        amiChart: amiChartOne,
        amiPercentage: "50",
        annualIncomeMax: "66600",
        annualIncomeMin: "41616",
        bmrProgramChart: false,
        floor: 2,
        maxOccupancy: 5,
        minOccupancy: 2,
        monthlyIncomeMin: "3468",
        monthlyRent: "1387",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: 1,
        numBedrooms: 2,
        number: null,
        sqFeet: "748",
      },
      {
        amiChart: amiChartTwo,
        amiPercentage: "50",
        annualIncomeMax: "66600",
        annualIncomeMin: "41616",
        bmrProgramChart: false,
        floor: 2,
        maxOccupancy: 5,
        minOccupancy: 2,
        monthlyIncomeMin: "3468",
        monthlyRent: "1387",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: 1,
        numBedrooms: 2,
        number: null,
        sqFeet: "748",
      },
    ]

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Multiple AMI and Percentages",
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = multipleAMIUnits.map(
      (unit) => {
        return {
          ...unit,
          listing: { id: newListing.id },
        }
      }
    )

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeOneBdrm
    unitsToBeCreated[2].unitType = unitTypeOneBdrm
    unitsToBeCreated[3].unitType = unitTypeOneBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return newListing
  }
}

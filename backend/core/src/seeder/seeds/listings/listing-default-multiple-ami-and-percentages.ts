import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity } from "typeorm"
import { UnitSeedType } from "./listings"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitStatus } from "../../../units/types/unit-status-enum"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultMultipleAMIAndPercentages extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })
    const amiChartOne = await this.amiChartRepository.findOneOrFail({
      name: "San Jose TCAC 2019",
      jurisdiction: alamedaJurisdiction,
    })
    const amiChartTwo = await this.amiChartRepository.findOneOrFail({
      name: "AlamedaCountyTCAC2021",
      jurisdiction: alamedaJurisdiction,
    })


    const multipleAMIUnits: Array<UnitSeedType> = [
      {
        amiChartId: amiChartOne.id,
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
        status: UnitStatus.available,
      },
      {
        amiChartId: amiChartTwo.id,
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
        status: UnitStatus.available,
      },
      {
        amiChartId: amiChartOne.id,
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
        status: UnitStatus.available,
      },
      {
        amiChartId: amiChartTwo.id,
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
        status: UnitStatus.available,
      },
    ]

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = multipleAMIUnits.map(
      (unit) => {
        return {
          ...unit,
        }
      }
    )

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeOneBdrm
    unitsToBeCreated[2].unitType = unitTypeOneBdrm
    unitsToBeCreated[3].unitType = unitTypeOneBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Multiple AMI and Percentages",
    })
  }
}

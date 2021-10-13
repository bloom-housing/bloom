import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultAmiChart, getDefaultProperty } from "./shared"
import { tritonAmiChart } from "./listing-triton-seed"
import { BaseEntity } from "typeorm"
import { UnitSeedType } from "./listings"
import { UnitStatus } from "../../units/types/unit-status-enum"
import { UnitCreateDto } from "../../units/dto/unit-create.dto"
import { CountyCode } from "../../shared/types/county-code"

export class ListingDefaultMultipleAMIAndPercentages extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })
    const amiChartOne = await this.amiChartRepository.save({
      ...tritonAmiChart,
      jurisdiction: alamedaJurisdiction,
    })
    const amiChartTwo = await this.amiChartRepository.save({
      ...getDefaultAmiChart(),
      jurisdiction: alamedaJurisdiction,
    })

    const property = await this.propertyRepository.save({
      ...getDefaultProperty(),
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
        status: UnitStatus.available,
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
        status: UnitStatus.available,
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
        status: UnitStatus.available,
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
        status: UnitStatus.available,
      },
    ]

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = multipleAMIUnits.map(
      (unit) => {
        return {
          ...unit,
          property: {
            id: property.id,
          },
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
      property: property,
      name: "Test: Default, Multiple AMI and Percentages",
    })
  }
}

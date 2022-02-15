import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity } from "typeorm"
import { UnitSeedType } from "./listings"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitStatus } from "../../../units/types/unit-status-enum"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultMissingAMI extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })

    const amiChart = await this.amiChartRepository.findOneOrFail({
      name: "Missing Household Ami Levels",
      jurisdiction: alamedaJurisdiction,
    })

    const missingAmiLevelsUnits: Array<UnitSeedType> = [
      {
        amiChartId: amiChart.id,
        amiPercentage: "50",
        annualIncomeMax: "177300.0",
        annualIncomeMin: "84696.0",
        floor: 1,
        maxOccupancy: 5,
        minOccupancy: 2,
        monthlyIncomeMin: "7058.0",
        monthlyRent: "3340.0",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: null,
        numBedrooms: 2,
        number: null,
        priorityType: null,
        sqFeet: "1100",
        status: UnitStatus.occupied,
      },
      {
        amiChartId: amiChart.id,
        amiPercentage: "50",
        annualIncomeMax: "103350.0",
        annualIncomeMin: "58152.0",
        floor: 1,
        maxOccupancy: 2,
        minOccupancy: 1,
        monthlyIncomeMin: "4858.0",
        monthlyRent: "2624.0",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: null,
        numBedrooms: 1,
        number: null,
        priorityType: null,
        sqFeet: "750",
        status: UnitStatus.occupied,
      },
      {
        amiChartId: amiChart.id,
        amiPercentage: "50",
        annualIncomeMax: "103350.0",
        annualIncomeMin: "58152.0",
        floor: 1,
        maxOccupancy: 2,
        minOccupancy: 1,
        monthlyIncomeMin: "4858.0",
        monthlyRent: "2624.0",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: null,
        numBedrooms: 1,
        number: null,
        priorityType: null,
        sqFeet: "750",
        status: UnitStatus.occupied,
      },
      {
        amiChartId: amiChart.id,
        amiPercentage: "50",
        annualIncomeMax: "103350.0",
        annualIncomeMin: "58152.0",
        floor: 1,
        maxOccupancy: 2,
        minOccupancy: 1,
        monthlyIncomeMin: "4858.0",
        monthlyRent: "2624.0",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: null,
        numBedrooms: 1,
        number: null,
        priorityType: null,
        sqFeet: "750",
        status: UnitStatus.occupied,
      },
      {
        amiChartId: amiChart.id,
        amiPercentage: "50",
        annualIncomeMax: "103350.0",
        annualIncomeMin: "38952.0",
        floor: 1,
        maxOccupancy: 2,
        minOccupancy: 1,
        monthlyIncomeMin: "3246.0",
        monthlyRent: "1575.0",
        monthlyRentAsPercentOfIncome: null,
        numBathrooms: null,
        numBedrooms: 1,
        number: null,
        priorityType: null,
        sqFeet: "750",
        status: UnitStatus.occupied,
      },
    ]

    const unitsToBeCreated: Array<Omit<
      UnitCreateDto,
      keyof BaseEntity
    >> = missingAmiLevelsUnits.map((unit) => {
      return {
        ...unit,
        amiChart,
      }
    })

    unitsToBeCreated.forEach((unit) => {
      unit.unitType = unitTypeOneBdrm
    })

    await this.unitsRepository.save(unitsToBeCreated)

    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Missing Household Levels in AMI",
    })
  }
}

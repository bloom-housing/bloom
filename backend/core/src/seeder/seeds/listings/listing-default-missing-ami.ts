import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity } from "typeorm"
import { UnitSeedType } from "./listings"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultMissingAMI extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.bay_area,
    })

    const amiChart = await this.amiChartRepository.findOneOrFail({
      name: "Missing Household Ami Levels",
      jurisdiction: bayAreaJurisdiction,
    })

    const missingAmiLevelsUnits: Array<UnitSeedType> = [
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
    ]

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Missing Household Levels in AMI",
    })

    const unitsToBeCreated: Array<Omit<
      UnitCreateDto,
      keyof BaseEntity
    >> = missingAmiLevelsUnits.map((unit) => {
      return {
        ...unit,
        amiChart,
        listing: { id: newListing.id },
      }
    })

    unitsToBeCreated.forEach((unit) => {
      unit.unitType = unitTypeOneBdrm
    })

    await this.unitsRepository.save(unitsToBeCreated)

    return newListing
  }
}

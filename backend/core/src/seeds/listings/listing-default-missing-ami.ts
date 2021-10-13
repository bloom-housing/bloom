import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultProperty } from "./shared"
import { BaseEntity } from "typeorm"
import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { UnitSeedType } from "./listings"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { UnitStatus } from "../../units/types/unit-status-enum"
import { UnitCreateDto } from "../../units/dto/unit-create.dto"
import { CountyCode } from "../../shared/types/county-code"

export const missingAmiLevelsChart: Omit<AmiChartCreateDto, "jurisdiction"> = {
  name: "Missing Household Ami Levels",
  items: [
    {
      percentOfAmi: 50,
      householdSize: 3,
      income: 65850,
    },
    {
      percentOfAmi: 50,
      householdSize: 4,
      income: 73150,
    },
    {
      percentOfAmi: 50,
      householdSize: 5,
      income: 79050,
    },
    {
      percentOfAmi: 50,
      householdSize: 6,
      income: 84900,
    },
    {
      percentOfAmi: 50,
      householdSize: 7,
      income: 90750,
    },
    {
      percentOfAmi: 50,
      householdSize: 8,
      income: 96600,
    },
  ],
}

const missingAmiLevelsUnits: Array<UnitSeedType> = [
  {
    amiChart: missingAmiLevelsChart as AmiChart,
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
    amiChart: missingAmiLevelsChart as AmiChart,
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
    amiChart: missingAmiLevelsChart as AmiChart,
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
    amiChart: missingAmiLevelsChart as AmiChart,
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
    amiChart: missingAmiLevelsChart as AmiChart,
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
export class ListingDefaultMissingAMI extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })
    const amiChart = await this.amiChartRepository.save({
      ...missingAmiLevelsChart,
      jurisdiction: alamedaJurisdiction,
    })

    const property = await this.propertyRepository.save({
      ...getDefaultProperty(),
    })

    const unitsToBeCreated: Array<Omit<
      UnitCreateDto,
      keyof BaseEntity
    >> = missingAmiLevelsUnits.map((unit) => {
      return {
        ...unit,
        property: {
          id: property.id,
        },
        amiChart,
      }
    })

    unitsToBeCreated.forEach((unit) => {
      unit.unitType = unitTypeOneBdrm
    })

    await this.unitsRepository.save(unitsToBeCreated)

    return await this.listingRepository.save({
      ...listing,
      property: property,
      name: "Test: Default, Missing Household Levels in AMI",
    })
  }
}

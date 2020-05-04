import { MinMax, MinMaxCurrency } from "./general"

export interface Unit {
  id: string
  amiPercentage: string
  annualIncomeMin: string
  monthlyIncomeMin: number
  floor: number
  annualIncomeMax: string
  maxOccupancy: number
  minOccupancy: number
  monthlyRent: number
  numBathrooms: number
  numBedrooms: number
  number: string
  priorityType: string
  reservedType: string
  sqFeet: number
  status: string
  unitType: string
  createdAt: Date
  updatedAt: Date
  listingId: number
  amiChartId: number
  monthlyRentAsPercentOfIncome: number
}

export interface UnitSummary {
  unitType: string
  minIncomeRange: MinMax | MinMaxCurrency
  occupancyRange: MinMax
  rentAsPercentIncomeRange: MinMax
  rentRange: MinMax | MinMaxCurrency
  totalAvailable: number
  areaRange: MinMax
  floorRange?: MinMax
}

export interface UnitSummaryByReservedType {
  reservedType: string
  byUnitType: UnitSummary[]
}

export interface UnitSummaryByAMI {
  percent: string
  byNonReservedUnitType: UnitSummary[]
  byReservedType: UnitSummaryByReservedType[]
}

export interface UnitsSummarized {
  unitTypes: string[]
  reservedTypes: string[]
  priorityTypes: string[]
  amiPercentages: string[]
  byUnitType: UnitSummary[]
  byNonReservedUnitType: UnitSummary[]
  byReservedType: UnitSummaryByReservedType[]
  byAMI: UnitSummaryByAMI[]
  hmi: { [key: string]: any }
}

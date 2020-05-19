import { MinMax, MinMaxCurrency } from "./general"

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

import { MinMax } from "./general"

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
  minIncomeRange: MinMax
  occupancyRange: MinMax
  rentAsPercentIncomeRange: MinMax
  rentRange: MinMax
  reservedTypes: [string]
  totalAvailable: number
  areaRange: MinMax
  floorRange: MinMax
}

export interface UnitsSummarized {
  all: [Unit]
  grouped: UnitGroup[]
  reserved: UnitGroup[]
  priority: UnitGroup[]
  unitTypes: string[]
  unitSummary: UnitSummary
}

export interface UnitGroup {
  units: [Unit]
  type: string
  unitSummary: UnitSummary
}

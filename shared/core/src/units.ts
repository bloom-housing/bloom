import { MinMax } from "./general"

export interface Unit {
  id: string
  ami_percentage: string
  annual_income_min: string
  monthly_income_min: number
  floor: number
  annual_income_max: string
  max_occupancy: number
  min_occupancy: number
  monthly_rent: number
  numBathrooms: number
  numBedrooms: number
  number: string
  priority_type: string
  reserved_type: string
  sqFeet: number
  status: string
  unit_type: string
  created_at: Date
  updated_at: Date
  listing_id: number
  ami_chart_id: number
  monthly_rent_as_percent_of_income: number
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
  unity: any
}

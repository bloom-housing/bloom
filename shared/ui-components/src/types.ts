export interface Listing {
  id: number
  name: string
  image_url?: string
  building_street_address: string
  building_city: string
  building_state: string
  building_zip_code: string
  neighborhood: string
  year_built: number
  required_documents: string
  smoking_policy: string
  pet_policy: string
  amenities: string
  developer: string
  credit_history: string
  rental_history: string
  units: [Unit]
  groupedUnits: GroupedUnitsWithSummaries
}

export interface Unit {
  id: number
  ami_percentage: string
  annual_income_min: string
  monthly_income_min: string
  floor: number
  annual_income_max: string
  max_occupancy: number
  min_occupancy: number
  monthly_rent: string
  num_bathrooms: number
  num_bedrooms: number
  number: string
  priority_type: string
  reserved_type: string
  sq_ft: number
  status: string
  unit_type: string
  created_at: Date
  updated_at: Date
  listing_id: number
  ami_chart_id: number
  monthly_rent_as_percent_of_income: number
  sq_ft_label: string
}

export type UnitGroup = [string, [Unit]]
export type GroupedUnits = UnitGroup[]
export interface UnitGroupSummary {
  unit_type_label: string
  area_range: string
  floor_range: string
}
export type UnitGroupWithSummary = [string, Units, UnitGroupSummary]
export type GroupedUnitsWithSummaries = UnitGroupWithSummary[]

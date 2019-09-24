export interface Listing {
  accepting_applications_at_leasing_agent: boolean
  accepting_applications_by_po_box: boolean
  amenities: string
  application_city: string
  application_download_url: string
  application_due_date: string
  application_organization: string
  application_postal_code: string
  application_state: string
  application_street_address: string
  blank_paper_application_can_be_picked_up: boolean
  building_city: string
  building_state: string
  building_street_address: string
  building_zip_code: string
  credit_history: string
  developer: string
  groupedUnits: GroupedUnitsWithSummaries
  id: string
  image_url?: string
  leasing_agent_city: string
  leasing_agent_email: string
  leasing_agent_name: string
  leasing_agent_office_hours: string
  leasing_agent_phone: string
  leasing_agent_state: string
  leasing_agent_street: string
  leasing_agent_title: string
  leasing_agent_zip: string
  name: string
  neighborhood: string
  pet_policy: string
  rental_history: string
  required_documents: string
  smoking_policy: string
  unit_summaries: [UnitSummary]
  units: [Unit]
  year_built: number
}

export interface Address {
  city: string
  state: string
  streetAddress: string
  zipCode: string
}

export interface Unit {
  id: string
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

interface MinMax {
  min?: string | number
  max?: string | number
}
export interface UnitSummary {
  min_income_range: MinMax
  occupancy_range: MinMax
  rent_as_percent_income_range: MinMax
  rent_range: MinMax
  unit_type: string
  reserved_types: [string]
  total_available: number
}

export type UnitGroup = [string, [Unit]]
export type GroupedUnits = UnitGroup[]
export interface UnitGroupSummary {
  unit_type_label: string
  area_range: string
  floor_range: string
}
export type UnitGroupWithSummary = [string, [Unit], UnitGroupSummary]
export type GroupedUnitsWithSummaries = UnitGroupWithSummary[]

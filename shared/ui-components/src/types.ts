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
  unitsSummarized: UnitsSummarized
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

export interface MinMax {
  min?: number
  max?: number
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

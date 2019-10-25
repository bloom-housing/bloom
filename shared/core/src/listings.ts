import { Unit, UnitSummary, UnitsSummarized } from "./units"

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

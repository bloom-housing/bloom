export interface Listing {
  amenities: string
  building_city: string
  building_state: string
  building_street_address: string
  building_zip_code: string
  credit_history: string
  developer: string
  id: number
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
  year_built: number
}

export interface Address {
  city: string
  state: string
  streetAddress: string
  zipCode: string
}

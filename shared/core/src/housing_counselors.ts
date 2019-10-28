export interface HousingCounselor {
  name: string
  languages: string[]
  address?: string
  citystate?: string
  // TBD if we want to enforce phone, address, website etc as types
  phone?: string
  website?: string
}

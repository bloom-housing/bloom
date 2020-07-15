export interface Address {
  placeName?: string
  city: string
  county: string
  state: string
  street: string
  street2?: string
  zipCode: string
  latitude: number
  longitude: number
}

export interface MinMax {
  min: number
  max: number
}

export interface MinMaxCurrency {
  min: string
  max: string
}

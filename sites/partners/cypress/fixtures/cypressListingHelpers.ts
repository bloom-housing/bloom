import {
  Address,
  Listing,
  ListingEventsTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type CypressListingImage = {
  fixtureName: string
  altText?: string
}
export type CypressListing = Listing & {
  "jurisdiction.id": string
  events: CypressListingEvent[]
  dueDate?: CypressListingDateTime
  postmarkDate?: CypressListingDateTime
  editedName: string
  cypressImages?: CypressListingImage[]
  listingsBuildingAddress: CypressAddress
  listingsApplicationMailingAddress: CypressAddress
  listingsLeasingAgentAddress: CypressAddress
  cypressUtilities?: CypressListingFeatures[]
  cypressFeatures?: CypressListingFeatures[]
}

export type CypressListingDateTime = {
  day: string
  month: string
  year: string
  startHours: string
  startMinutes: string
  endHours: string
  endMinutes: string
  period: "am" | "pm"
}

export type CypressListingEvent = {
  type: ListingEventsTypeEnum
  dateTime: CypressListingDateTime
  note: string
  label: string
  url: string
}

export type CypressListingFeatures = {
  key: string
  translation: string
}

export type CypressAddress = Address & {
  abbreviatedState?: string
}

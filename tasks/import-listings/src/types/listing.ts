/**
 * This object represents the items returned from the listings API. Except in
 * cases where properties are being accessed, it is preferred to use
 * `Record<string, unknown>` for the type of complex objects as they are always
 * converted into strings regardless.
 */
export class Listing {
  id: string
  assets: Array<Record<string, unknown>>
  unitsAvailable: number
  applicationDueDate: string
  applicationOpenDate: string
  name: string
  waitlistCurrentSize: number
  waitlistMaxSize: number
  isWaitListOpen: boolean
  status: string
  reviewOrderType: string
  publishedAt: string
  closedAt: string
  updatedAt: string
  countyCode: string
  city: string
  neighborhood: string
  reservedCommunityType: { name: string }
  urlSlug: string
  unitsSummarized?: Array<Record<string, unknown>> | null
  images: Array<Record<string, unknown>>
  listingMultiselectQuestions: Array<Record<string, unknown>>
  jurisdiction: { name: string; id: string }
  units: Array<Record<string, unknown>>
  buildingAddress: { city: string; county?: string }
  features: Record<string, boolean>
  utilities: Record<string, boolean>
}

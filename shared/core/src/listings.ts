import { Unit, UnitsSummarized } from "./units"
import { Address } from "./general"
import { Preference } from "./preferences"

export enum AttachmentType {
  ApplicationDownload = 1,
  ExternalApplication = 2,
}

export interface Attachment {
  label: string
  fileUrl: string
  type: AttachmentType
}

export enum ApplicationMethodType {
  Internal = 1,
  FileDownload = 2,
  ExternalLink = 3,
  PaperPickup = 4,
  POBox = 5,
  LeasingAgent = 6,
}

export interface ApplicationMethod {
  type: ApplicationMethodType
  label?: string
  externalReference?: string
  acceptsPostmarkedApplications?: boolean
}

export interface WhatToExpect {
  applicantsWillBeContacted: string
  allInfoWillBeVerified: string
  bePreparedIfChosen: string
}

export interface HouseholdMember {
  address: Address
  id?: number
  firstName: string
  middleName: string
  lastName: string
  birthMonth: number
  birthDay: number
  birthYear: number
  emailAddress: string
  noEmail: boolean
  phoneNumber: string
  phoneNumberType: string
  noPhone: boolean
  sameAddress?: boolean
  relationship?: string
  workInRegion?: boolean
  workAddress?: Address
}

export interface Listing {
  applicationPickUpAddress?: Address
  applicationPickUpAddressOfficeHours?: string
  accessibility: string
  amenities: string
  applicationDueDate: string
  applicationOpenDate?: string
  applicationFee: string
  applicationOrganization: string
  applicationAddress: Address
  applicationMethods: ApplicationMethod[]
  attachments: Attachment[]
  buildingAddress: Address
  buildingTotalUnits: number
  buildingSelectionCriteria: string
  costsNotIncluded: string
  creditHistory: string
  criminalBackground: string
  depositMin: string
  depositMax?: string
  depositMaxExtraText?: string
  developer: string
  disableUnitsAccordion?: boolean
  householdSizeMax?: number
  householdSizeMin?: number
  id: string
  imageUrl?: string
  leasingAgentAddress: Address
  leasingAgentEmail: string
  leasingAgentName: string
  leasingAgentOfficeHours: string
  leasingAgentPhone: string
  leasingAgentTitle: string
  name: string
  neighborhood: string
  preferences: Preference[]
  petPolicy: string
  postmarkedApplicationsReceivedByDate: string
  programRules?: string
  rentalHistory: string
  requiredDocuments: string
  smokingPolicy: string
  units: Unit[]
  unitsAvailable: number
  unitAmenities: string
  unitsSummarized?: UnitsSummarized
  urlSlug?: string
  waitlistCurrentSize: number
  waitlistMaxSize: number
  whatToExpect?: WhatToExpect
  yearBuilt: number
}

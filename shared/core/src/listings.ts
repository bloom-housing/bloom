import { Unit, UnitSummary, UnitsSummarized } from "./units"
import { Address } from "./general"
import { Preference } from "./preferences"

export enum AttachmentType {
  ApplicationDownload = 1
}

export interface Attachment {
  label: string
  fileUrl: string
  type: AttachmentType
}

export interface Listing {
  acceptingApplicationsAtLeasingAgent: boolean
  acceptingApplicationsByPoBox: boolean
  acceptsPostmarkedApplications: boolean
  accessibility: string
  amenities: string
  applicationDueDate: string
  applicationOrganization: string
  applicationAddress: Address
  attachments: Attachment[]
  blankPaperApplicationCanBePickedUp: boolean
  buildingAddress: Address
  creditHistory: string
  developer: string
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
  rentalHistory: string
  requiredDocuments: string
  smokingPolicy: string
  unitAmenities: string
  unit_summaries?: UnitSummary[]
  units: Unit[]
  unitsSummarized?: UnitsSummarized
  yearBuilt: number
}

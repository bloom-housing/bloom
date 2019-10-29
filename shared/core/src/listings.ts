import { Unit, UnitSummary, UnitsSummarized } from "./units"
import { Address } from "./general"

export interface Listing {
  acceptingApplicationsAtLeasingAgent: boolean
  acceptingApplicationsByPoBox: boolean
  amenities: string
  applicationDownloadUrl: string
  applicationDueDate: string
  applicationOrganization: string
  applicationAddress: Address
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
  petPolicy: string
  rentalHistory: string
  requiredDocuments: string
  smokingPolicy: string
  unit_summaries: [UnitSummary]
  units: [Unit]
  unitsSummarized: UnitsSummarized
  yearBuilt: number
}

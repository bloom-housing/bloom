import { Unit, UnitSummary, UnitsSummarized } from "./units"

export interface Listing {
  acceptingApplicationsAtLeasingAgent: boolean
  acceptingApplicationsByPoBox: boolean
  acceptsPostmarkedApplications: boolean
  amenities: string
  applicationCity: string
  applicationDownloadUrl: string
  applicationDueDate: string
  applicationOrganization: string
  applicationPostalCode: string
  applicationState: string
  applicationStreetAddress: string
  blankPaperApplicationCanBePickedUp: boolean
  buildingCity: string
  buildingState: string
  buildingStreetAddress: string
  buildingZipCode: string
  creditHistory: string
  developer: string
  id: string
  imageUrl?: string
  leasingAgentCity: string
  leasingAgentEmail: string
  leasingAgentName: string
  leasingAgentOfficeHours: string
  leasingAgentPhone: string
  leasingAgentState: string
  leasingAgentStreet: string
  leasingAgentTitle: string
  leasingAgentZip: string
  name: string
  neighborhood: string
  petPolicy: string
  postmarkedApplicationsReceivedByDate: string
  rentalHistory: string
  requiredDocuments: string
  smokingPolicy: string
  unit_summaries?: UnitSummary[]
  units: Unit[]
  unitsSummarized?: UnitsSummarized
  yearBuilt: number
}

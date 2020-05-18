import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Unit } from "./Unit"
import { Preference } from "./Preference"
import { Attachment } from "./Attachment"
import { Address, UnitsSummarized } from "@bloom-housing/core"

@Entity()
export class Listing {
  @OneToMany(
    type => Preference,
    preference => preference.listing
  )
  preferences: Preference[]
  @OneToMany(
    type => Unit,
    unit => unit.listing
  )
  units: Unit[]
  @OneToMany(
    type => Attachment,
    attachment => attachment.listing
  )
  attachments: Attachment[]
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ type: "boolean", nullable: true })
  acceptingApplicationsAtLeasingAgent: boolean
  @Column({ type: "boolean", nullable: true })
  acceptingApplicationsByPoBox: boolean
  @Column({ type: "boolean", nullable: true })
  acceptingOnlineApplications: boolean
  @Column({ type: "boolean", nullable: true })
  acceptsPostmarkedApplications: boolean
  @Column({ type: "string", nullable: true })
  accessibility: string
  @Column({ type: "string", nullable: true })
  amenities: string
  @Column({ type: "string", nullable: true })
  applicationDueDate: string
  @Column({ type: "string", nullable: true })
  applicationOpenDate?: string
  @Column({ type: "string", nullable: true })
  applicationFee: string
  @Column({ type: "string", nullable: true })
  applicationOrganization: string
  @Column({ type: "jsonb", nullable: true })
  applicationAddress: Address
  @Column({ type: "boolean", nullable: true })
  blankPaperApplicationCanBePickedUp: boolean
  @Column({ type: "jsonb", nullable: true })
  buildingAddress: Address
  @Column({ type: "number", nullable: true })
  buildingTotalUnits: number
  @Column({ type: "string", nullable: true })
  buildingSelectionCriteria: string
  @Column({ type: "string", nullable: true })
  costsNotIncluded: string
  @Column({ type: "string", nullable: true })
  creditHistory: string
  @Column({ type: "string", nullable: true })
  criminalBackground: string
  @Column({ type: "string", nullable: true })
  depositMin: string
  @Column({ type: "string", nullable: true })
  depositMax?: string
  @Column({ type: "string", nullable: true })
  developer: string
  @Column({ type: "boolean", nullable: true })
  disableUnitsAccordion?: boolean
  @Column({ type: "string", nullable: true })
  imageUrl?: string
  @Column({ type: "jsonb", nullable: true })
  leasingAgentAddress: Address
  @Column({ type: "string", nullable: true })
  leasingAgentEmail: string
  @Column({ type: "string", nullable: true })
  leasingAgentName: string
  @Column({ type: "string", nullable: true })
  leasingAgentOfficeHours: string
  @Column({ type: "string", nullable: true })
  leasingAgentPhone: string
  @Column({ type: "string", nullable: true })
  leasingAgentTitle: string
  @Column({ type: "string", nullable: true })
  name: string
  @Column({ type: "string", nullable: true })
  neighborhood: string
  @Column({ type: "string", nullable: true })
  petPolicy: string
  @Column({ type: "string", nullable: true })
  postmarkedApplicationsReceivedByDate: string
  @Column({ type: "string", nullable: true })
  programRules?: string
  @Column({ type: "string", nullable: true })
  rentalHistory: string
  @Column({ type: "string", nullable: true })
  requiredDocuments: string
  @Column({ type: "string", nullable: true })
  smokingPolicy: string
  @Column({ type: "number", nullable: true })
  unitsAvailable: number
  @Column({ type: "string", nullable: true })
  unitAmenities: string
  // @Column({ nullable: true })
  // unitsSummarized?: UnitsSummarized
  @Column({ type: "number", nullable: true })
  waitlistCurrentSize: number
  @Column({ type: "number", nullable: true })
  waitlistMaxSize: number
  @Column({ type: "number", nullable: true })
  yearBuilt: number

  unitsSummarized?: UnitsSummarized
}

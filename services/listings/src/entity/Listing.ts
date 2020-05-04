import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Unit } from "./Unit"
import { Preference } from "./Preference"
import { Attachment } from "./Attachment"
import { Address } from "@bloom-housing/core"

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
  @Column({ nullable: true })
  acceptingApplicationsAtLeasingAgent: boolean
  @Column({ nullable: true })
  acceptingApplicationsByPoBox: boolean
  @Column({ nullable: true })
  acceptingOnlineApplications: boolean
  @Column({ nullable: true })
  acceptsPostmarkedApplications: boolean
  @Column({ nullable: true })
  accessibility: string
  @Column({ nullable: true })
  amenities: string
  @Column({ nullable: true })
  applicationDueDate: string
  @Column({ nullable: true })
  applicationOpenDate?: string
  @Column({ nullable: true })
  applicationFee: string
  @Column({ nullable: true })
  applicationOrganization: string
  @Column({ type: "jsonb", nullable: true })
  applicationAddress: Address
  @Column({ nullable: true })
  blankPaperApplicationCanBePickedUp: boolean
  @Column({ type: "jsonb", nullable: true })
  buildingAddress: Address
  @Column({ nullable: true })
  buildingTotalUnits: number
  @Column({ nullable: true })
  buildingSelectionCriteria: string
  @Column({ nullable: true })
  costsNotIncluded: string
  @Column({ nullable: true })
  creditHistory: string
  @Column({ nullable: true })
  criminalBackground: string
  @Column({ nullable: true })
  depositMin: string
  @Column({ nullable: true })
  depositMax?: string
  @Column({ nullable: true })
  developer: string
  @Column({ nullable: true })
  disableUnitsAccordion?: boolean
  @Column({ nullable: true })
  imageUrl?: string
  @Column({ type: "jsonb", nullable: true })
  leasingAgentAddress: Address
  @Column({ nullable: true })
  leasingAgentEmail: string
  @Column({ nullable: true })
  leasingAgentName: string
  @Column({ nullable: true })
  leasingAgentOfficeHours: string
  @Column({ nullable: true })
  leasingAgentPhone: string
  @Column({ nullable: true })
  leasingAgentTitle: string
  @Column({ nullable: true })
  name: string
  @Column({ nullable: true })
  neighborhood: string
  @Column({ nullable: true })
  petPolicy: string
  @Column({ nullable: true })
  postmarkedApplicationsReceivedByDate: string
  @Column({ nullable: true })
  programRules?: string
  @Column({ nullable: true })
  rentalHistory: string
  @Column({ nullable: true })
  requiredDocuments: string
  @Column({ nullable: true })
  smokingPolicy: string
  @Column({ nullable: true })
  unitsAvailable: number
  @Column({ nullable: true })
  unitAmenities: string
  // @Column({ nullable: true })
  // unitsSummarized?: UnitsSummarized
  @Column({ nullable: true })
  waitlistCurrentSize: number
  @Column({ nullable: true })
  waitlistMaxSize: number
  @Column({ nullable: true })
  yearBuilt: number
}

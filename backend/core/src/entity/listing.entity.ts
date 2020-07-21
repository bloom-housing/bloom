import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm"
import { Unit } from "./unit.entity"
import { Preference } from "./preference.entity"
import { Attachment } from "./attachment.entity"
import { Address, UnitsSummarized, WhatToExpect } from "@bloom-housing/core"
import { Application } from "./application.entity"

@Entity({ name: "listings" })
class Listing extends BaseEntity {
  @OneToMany((type) => Preference, (preference) => preference.listing)
  preferences: Preference[]
  @OneToMany((type) => Unit, (unit) => unit.listing)
  units: Unit[]
  @OneToMany((type) => Attachment, (attachment) => attachment.listing)
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
  @Column({ type: "text", nullable: true })
  accessibility: string
  @Column({ type: "text", nullable: true })
  amenities: string
  @Column({ type: "text", nullable: true })
  applicationDueDate: string
  @Column({ type: "text", nullable: true })
  applicationOpenDate?: string
  @Column({ type: "text", nullable: true })
  applicationFee: string
  @Column({ type: "text", nullable: true })
  applicationOrganization: string
  @Column({ type: "jsonb", nullable: true })
  applicationAddress: Address
  @Column({ type: "boolean", nullable: true })
  blankPaperApplicationCanBePickedUp: boolean
  @Column({ type: "jsonb", nullable: true })
  buildingAddress: Address
  @Column({ type: "numeric", nullable: true })
  buildingTotalUnits: number
  @Column({ type: "text", nullable: true })
  buildingSelectionCriteria: string
  @Column({ type: "text", nullable: true })
  costsNotIncluded: string
  @Column({ type: "text", nullable: true })
  creditHistory: string
  @Column({ type: "text", nullable: true })
  criminalBackground: string
  @Column({ type: "text", nullable: true })
  depositMin: string
  @Column({ type: "text", nullable: true })
  depositMax?: string
  @Column({ type: "text", nullable: true })
  developer: string
  @Column({ type: "boolean", nullable: true })
  disableUnitsAccordion?: boolean
  @Column({ type: "numeric", nullable: true })
  householdSizeMax?: number
  @Column({ type: "numeric", nullable: true })
  householdSizeMin?: number
  @Column({ type: "text", nullable: true })
  imageUrl?: string
  @Column({ type: "jsonb", nullable: true })
  leasingAgentAddress: Address
  @Column({ type: "text", nullable: true })
  leasingAgentEmail: string
  @Column({ type: "text", nullable: true })
  leasingAgentName: string
  @Column({ type: "text", nullable: true })
  leasingAgentOfficeHours: string
  @Column({ type: "text", nullable: true })
  leasingAgentPhone: string
  @Column({ type: "text", nullable: true })
  leasingAgentTitle: string
  @Column({ type: "text", nullable: true })
  name: string
  @Column({ type: "text", nullable: true })
  neighborhood: string
  @Column({ type: "text", nullable: true })
  petPolicy: string
  @Column({ type: "text", nullable: true })
  postmarkedApplicationsReceivedByDate: string
  @Column({ type: "text", nullable: true })
  programRules?: string
  @Column({ type: "text", nullable: true })
  rentalHistory: string
  @Column({ type: "text", nullable: true })
  requiredDocuments: string
  @Column({ type: "text", nullable: true })
  smokingPolicy: string
  @Column({ type: "numeric", nullable: true })
  unitsAvailable: number
  @Column({ type: "text", nullable: true })
  unitAmenities: string
  // @Column({ nullable: true })
  // unitsSummarized?: UnitsSummarized
  @Column({ type: "numeric", nullable: true })
  waitlistCurrentSize: number
  @Column({ type: "numeric", nullable: true })
  waitlistMaxSize: number
  @Column({ type: "jsonb", nullable: true })
  whatToExpect?: WhatToExpect
  @Column({ type: "numeric", nullable: true })
  yearBuilt: number

  unitsSummarized?: UnitsSummarized
  urlSlug?: string
  @OneToMany((type) => Application, (application) => application.listing)
  applications: Application[]
}

export { Listing as default, Listing }

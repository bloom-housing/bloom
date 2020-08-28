import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Listing, ListingStatus } from "./listing.entity"

export enum ApplicationMethodType {
  Internal = "Internal",
  FileDownload = "FileDownload",
  ExternalLink = "ExternalLink",
  PaperPickup = "PaperPickup",
  POBox = "POBox",
  LeasingAgent = "LeasingAgent",
}

@Entity({ name: "application_methods" })
export class ApplicationMethod extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({
    type: "enum",
    enum: ApplicationMethodType,
  })
  type: ApplicationMethodType
  @Column({ type: "text", nullable: true })
  label?: string
  @Column({ type: "text", nullable: true })
  externalReference?: string
  @Column({ type: "boolean", nullable: true })
  acceptsPostmarkedApplications?: boolean
  @ManyToOne((type) => Listing, (listing) => listing.applicationMethods)
  listing: Listing
}

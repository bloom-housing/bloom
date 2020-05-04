import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./Listing"

enum AttachmentType {
  ApplicationDownload = 1,
  ExternalApplication = 2
}

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ nullable: true })
  label: string
  @Column({ nullable: true })
  fileUrl: string
  @Column({
    type: "enum",
    enum: AttachmentType,
    nullable: true
  })
  type: AttachmentType
  @ManyToOne(
    type => Listing,
    listing => listing.attachments
  )
  listing: Listing
}

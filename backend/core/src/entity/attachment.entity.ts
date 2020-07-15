import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./listing.entity"

enum AttachmentType {
  ApplicationDownload = 1,
  ExternalApplication = 2,
}

@Entity({ name: "attachments" })
class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ type: "text", nullable: true })
  label: string
  @Column({ type: "text", nullable: true })
  fileUrl: string
  @Column({
    type: "enum",
    enum: AttachmentType,
    nullable: true,
  })
  type: AttachmentType
  @ManyToOne((type) => Listing, (listing) => listing.attachments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}

export { Attachment as default, Attachment }

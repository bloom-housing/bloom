import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Listing, Attachment } from "@bloom-housing/core"
import { ListingModel } from "./Listing"

enum AttachmentType {
  ApplicationDownload = 1,
  ExternalApplication = 2,
}

@Entity()
export class AttachmentModel implements Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: true })
  label: string

  @Column({ nullable: true })
  fileUrl: string

  @Column({
    type: "enum",
    enum: AttachmentType,
    nullable: true,
  })
  type: AttachmentType

  @ManyToOne((type) => ListingModel, (listing) => listing.attachments)
  listing: Listing
}

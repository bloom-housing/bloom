import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { ListingEntity } from "./listing.entity"

enum AttachmentType {
  ApplicationDownload = 1,
  ExternalApplication = 2,
}

@Entity()
class AttachmentEntity {
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
  @ManyToOne((type) => ListingEntity, (listing) => listing.attachments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: ListingEntity
}

export { AttachmentEntity as default, AttachmentEntity }

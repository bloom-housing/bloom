import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm"
import { ListingEntity } from "./listing.entity"
import { Preference, PreferenceLink } from "@bloom-housing/core"

@Entity()
class PreferenceEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ type: "text", nullable: true })
  ordinal: string
  @Column({ type: "text", nullable: true })
  title: string
  @Column({ type: "text", nullable: true })
  subtitle?: string
  @Column({ type: "text", nullable: true })
  description?: string
  @Column({ type: "jsonb", nullable: true })
  links?: PreferenceLink[]
  @ManyToOne((type) => ListingEntity, (listing) => listing.preferences, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: ListingEntity
}

export { PreferenceEntity as default, PreferenceEntity }

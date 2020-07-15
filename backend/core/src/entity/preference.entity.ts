import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./listing.entity"
import { PreferenceLink } from "@bloom-housing/core"

@Entity({ name: "preferences" })
class Preference {
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
  @ManyToOne((type) => Listing, (listing) => listing.preferences, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}

export { Preference as default, Preference }

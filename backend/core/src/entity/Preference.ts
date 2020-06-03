import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./Listing"
import { PreferenceLink } from "@bloom-housing/core"

@Entity()
class Preference {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ nullable: true })
  ordinal: string
  @Column({ nullable: true })
  title: string
  @Column({ nullable: true })
  subtitle?: string
  @Column({ nullable: true })
  description?: string
  @Column({ type: "jsonb", nullable: true })
  links?: PreferenceLink[]
  @ManyToOne(
    type => Listing,
    listing => listing.preferences
  )
  listing: Listing
}

export { Preference as default, Preference }

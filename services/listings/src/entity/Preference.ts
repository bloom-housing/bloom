import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Listing } from "./Listing"
import { PreferenceLink } from "@bloom-housing/core"

@Entity()
export class Preference {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ type: "string", nullable: true })
  ordinal: string
  @Column({ type: "string", nullable: true })
  title: string
  @Column({ type: "string", nullable: true })
  subtitle?: string
  @Column({ type: "string", nullable: true })
  description?: string
  @Column({ type: "jsonb", nullable: true })
  links?: PreferenceLink[]
  @ManyToOne(
    type => Listing,
    listing => listing.preferences
  )
  listing: Listing
}

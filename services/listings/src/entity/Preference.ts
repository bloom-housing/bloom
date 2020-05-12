import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { ListingModel } from "./Listing"
import { PreferenceLink } from "@bloom-housing/core"

@Entity()
export class Preference {
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
    type => ListingModel,
    listing => listing.preferences
  )
  listing: ListingModel
}

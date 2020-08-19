import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm"
import { Listing } from "./listing.entity"
import { PreferenceLink } from "@bloom-housing/core"
import { PreferenceTranslation } from "./preference-translation.entity"

@Entity({ name: "preferences" })
class Preference extends BaseEntity {
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

  @OneToMany(() => PreferenceTranslation, (translation) => translation.preference)
  translations: PreferenceTranslation[]

  languageCode: "us-EN"
}

export { Preference as default, Preference }

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm/index"
import { Preference } from "./preference.entity"
import { PreferenceLink } from "@bloom-housing/core"

@Entity({ name: "preferences_translations" })
class PreferenceTranslation extends BaseEntity {
  // Manually define this column ahead of languageCode so that it can appear first in the composite primary key that
  // gets generated for better indexing performance.
  // See https://github.com/typeorm/typeorm/issues/3069
  @PrimaryColumn({ type: "uuid" })
  preferenceId: string

  @PrimaryColumn({ type: "citext" })
  languageCode: string

  @ManyToOne(() => Preference, (pref) => pref.translations, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "preference_id" })
  preference: Preference

  @Column({ type: "text", nullable: true })
  ordinal?: string
  @Column({ type: "text", nullable: true })
  title?: string
  @Column({ type: "text", nullable: true })
  subtitle?: string
  @Column({ type: "text", nullable: true })
  description?: string
  @Column({ type: "jsonb", nullable: true })
  links?: PreferenceLink[]
}

export { PreferenceTranslation as default, PreferenceTranslation }

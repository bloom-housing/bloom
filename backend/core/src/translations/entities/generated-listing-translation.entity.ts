import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import { Language } from "../../shared/types/language-enum"

@Entity({ name: "generated_listing_translations" })
export class GeneratedListingTranslation extends AbstractEntity {
  @Column()
  @Expose()
  listingId: string

  @Column()
  @Expose()
  jurisdictionId: string

  @Column({ enum: Language })
  @Expose()
  language: Language

  @Column({ type: "jsonb" })
  @Expose()
  translations: any

  @Column()
  @Type(() => Date)
  timestamp: Date
}

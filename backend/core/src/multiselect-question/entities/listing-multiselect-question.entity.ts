import { Column, Entity, ManyToOne } from "typeorm"
import { MultiselectQuestion } from "./multiselect-question.entity"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "../../listings/entities/listing.entity"
import { AbstractEntity } from "../../shared/entities/abstract.entity"

@Entity({ name: "listing_multiselect_questions" })
export class ListingMultiselectQuestion extends AbstractEntity {
  @ManyToOne(() => Listing, (listing) => listing.listingMultiselectQuestions, {
    orphanedRowAction: "delete",
  })
  @Type(() => Listing)
  listing: Listing

  @ManyToOne(() => MultiselectQuestion, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @Type(() => MultiselectQuestion)
  multiselectQuestion: MultiselectQuestion

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null
}

import { Column, Entity, ManyToOne } from "typeorm"
import { MultiselectQuestion } from "./multiselect-question.entity"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "../../listings/entities/listing.entity"

@Entity({ name: "listing_multiselect_questions" })
export class ListingMultiselectQuestion {
  @ManyToOne(() => Listing, (listing) => listing.listingMultiselectQuestions, {
    primary: true,
    orphanedRowAction: "delete",
  })
  @Type(() => Listing)
  listing: Listing

  @ManyToOne(() => MultiselectQuestion, (question) => question.listingMultiselectQuestions, {
    primary: true,
    eager: true,
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

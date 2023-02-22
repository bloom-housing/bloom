import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"
import { MultiselectQuestion } from "./multiselect-question.entity"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "../../listings/entities/listing.entity"

@Entity({ name: "listing_multiselect_questions" })
export class ListingMultiselectQuestion {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  multiselectQuestionId: string

  @PrimaryColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  listingId: string

  @ManyToOne(() => Listing, (listing) => listing.listingMultiselectQuestions, {
    orphanedRowAction: "delete",
  })
  @Type(() => Listing)
  listing: Listing

  @ManyToOne(() => MultiselectQuestion, (question) => question.listingMultiselectQuestions, {
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

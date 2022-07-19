import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  ArrayMaxSize,
  IsBoolean,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { MultiselectLink } from "../types/multiselect-link"
import { MultiselectOption } from "../types/multiselect-option"

@Entity({ name: "listing_multiselect_questions" })
class MultiselectQuestion {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  title?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  subtitle?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  description?: string | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectLink)
  @ApiProperty({ type: [MultiselectLink] })
  links?: MultiselectLink[] | null

  @OneToMany(() => MultiselectQuestion, (question) => question.listingMultiselectQuestions)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectQuestion)
  listingMultiselectQuestions: MultiselectQuestion[]

  @ManyToMany(() => Jurisdiction, (jurisdiction) => jurisdiction.preferences)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdictions: Jurisdiction[]

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectOption)
  @ApiProperty({ type: [ListingMultiselectOption], nullable: true })
  options: ListingMultiselectOption[]

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  optOutText?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  hideFromListing?: boolean
}

export { ListingMultiselectQuestion as default, ListingMultiselectQuestion }

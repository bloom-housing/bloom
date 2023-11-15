import { Column, Entity, JoinTable, ManyToMany } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import {
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsBoolean,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Language } from "../../shared/types/language-enum"
import { Expose, Type } from "class-transformer"
import { MultiselectQuestion } from "../../multiselect-question/entities/multiselect-question.entity"
import { UserRoleEnum } from "../../../src/auth/enum/user-role-enum"

@Entity({ name: "jurisdictions" })
export class Jurisdiction extends AbstractEntity {
  @Column({ type: "text", unique: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  name: string

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  notificationsSignUpURL?: string | null

  @Column({ type: "enum", enum: Language, array: true, default: [Language.en] })
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default], each: true })
  languages: Language[]

  @Column({ type: "enum", enum: UserRoleEnum, array: true, nullable: true })
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(UserRoleEnum, { groups: [ValidationsGroupsEnum.default], each: true })
  listingApprovalPermissions?: UserRoleEnum[]

  @ManyToMany(
    () => MultiselectQuestion,
    (multiselectQuestion) => multiselectQuestion.jurisdictions,
    { cascade: true }
  )
  @JoinTable()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectQuestion)
  multiselectQuestions: MultiselectQuestion[]

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  partnerTerms?: string | null

  @Column({ type: "text", default: "" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  publicUrl: string

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  emailFromAddress: string

  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalAssistanceDefault: string

  @Column({ type: "boolean", nullable: false, default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  enablePartnerSettings?: boolean | null

  @Column({ type: "boolean", nullable: false, default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  enableAccessibilityFeatures: boolean | null

  @Column({ type: "boolean", nullable: false, default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  enableUtilitiesIncluded: boolean | null

  @Column({ type: "boolean", nullable: false, default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  enableGeocodingPreferences: boolean | null
}

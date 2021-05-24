import { ApiProperty, OmitType } from "@nestjs/swagger"
import {
  ArrayMaxSize,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { Application } from "../entities/application.entity"
import { Expose, plainToClass, Transform, Type } from "class-transformer"
import { IdDto } from "../../shared/dto/id.dto"
import { PaginationFactory } from "../../shared/dto/pagination.dto"
import { ApplicantCreateDto, ApplicantDto, ApplicantUpdateDto } from "./applicant.dto"
import { AddressCreateDto, AddressDto, AddressUpdateDto } from "../../shared/dto/address.dto"
import {
  AlternateContactCreateDto,
  AlternateContactDto,
  AlternateContactUpdateDto,
} from "./alternate-contact.dto"
import { DemographicsCreateDto, DemographicsDto, DemographicsUpdateDto } from "./demographics.dto"
import {
  HouseholdMemberCreateDto,
  HouseholdMemberDto,
  HouseholdMemberUpdateDto,
} from "./household-member.dto"
import {
  AccessibilityCreateDto,
  AccessibilityDto,
  AccessibilityUpdateDto,
} from "./accessibility.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IncomePeriod } from "../types/income-period-enum"
import { ApplicationStatus } from "../types/application-status-enum"
import { Language } from "../../shared/types/language-enum"
import { ApplicationSubmissionType } from "../types/application-submission-type-enum"
import { ApplicationPreference } from "../entities/application-preferences.entity"

export class ApplicationDto
  implements
    Omit<
      Application,
      | "applicant"
      | "listing"
      | "user"
      | "mailingAddress"
      | "alternateAddress"
      | "alternateContact"
      | "householdMembers"
    > {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  deletedAt?: Date

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  markedAsDuplicate: boolean

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  user?: IdDto | undefined

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  listing: IdDto | undefined

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantDto)
  applicant: ApplicantDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  additionalPhone?: boolean

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  additionalPhoneNumber?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  additionalPhoneNumberType?: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(8, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default], each: true })
  contactPreferences: string[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSize?: number

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  housingStatus?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  sendMailToMailingAddress?: boolean

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  mailingAddress: AddressDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  alternateAddress: AddressDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContactDto)
  alternateContact: AlternateContactDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityDto)
  accessibility: AccessibilityDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => DemographicsDto)
  demographics: DemographicsDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  incomeVouchers?: boolean

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  income?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsEnum(IncomePeriod, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: IncomePeriod, enumName: "IncomePeriod" })
  incomePeriod?: IncomePeriod

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMemberDto)
  householdMembers: HouseholdMemberDto[]

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(8, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default], each: true })
  preferredUnit: string[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationPreference)
  preferences: ApplicationPreference[]

  @Expose()
  @IsEnum(ApplicationStatus, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationStatus, enumName: "ApplicationStatus" })
  status: ApplicationStatus

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: Language, enumName: "Language" })
  language?: Language

  @Expose()
  @IsEnum(ApplicationSubmissionType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationSubmissionType, enumName: "ApplicationSubmissionType" })
  submissionType: ApplicationSubmissionType

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptedTerms?: boolean

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  submissionDate?: Date
}

export class PaginatedApplicationDto extends PaginationFactory<ApplicationDto>(ApplicationDto) {}

export class ApplicationCreateDto extends OmitType(ApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "user",
  "listing",
  "applicant",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics",
  "householdMembers",
  "markedAsDuplicate",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  listing: IdDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantCreateDto)
  applicant: ApplicantCreateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  mailingAddress: AddressCreateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  alternateAddress: AddressCreateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContactCreateDto)
  alternateContact: AlternateContactCreateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityCreateDto)
  accessibility: AccessibilityCreateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => DemographicsCreateDto)
  demographics: DemographicsCreateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMemberCreateDto)
  householdMembers: HouseholdMemberCreateDto[]
}

export class ApplicationUpdateDto extends OmitType(ApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "user",
  "listing",
  "applicant",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics",
  "householdMembers",
  "markedAsDuplicate",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  deletedAt?: Date

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  listing: IdDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantUpdateDto)
  applicant: ApplicantUpdateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  mailingAddress: AddressUpdateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  alternateAddress: AddressUpdateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContactUpdateDto)
  alternateContact: AlternateContactUpdateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityUpdateDto)
  accessibility: AccessibilityUpdateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => DemographicsUpdateDto)
  demographics: DemographicsUpdateDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMemberUpdateDto)
  householdMembers: HouseholdMemberUpdateDto[]
}

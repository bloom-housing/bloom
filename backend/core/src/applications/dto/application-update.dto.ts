import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsDate,
  IsDefined,
  IsOptional,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { ApplicantUpdateDto } from "./applicant.dto"
import { AddressUpdateDto } from "../../shared/dto/address.dto"
import { AlternateContactUpdateDto } from "./alternate-contact.dto"
import { AccessibilityUpdateDto } from "./accessibility.dto"
import { DemographicsUpdateDto } from "./demographics.dto"
import { HouseholdMemberUpdateDto } from "./household-member.dto"
import { ApplicationDto } from "./application.dto"

export class ApplicationUpdateDto extends OmitType(ApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "applicant",
  "listing",
  "user",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics",
  "householdMembers",
  "markedAsDuplicate",
  "flagged",
  "preferredUnit",
  "confirmationCode",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

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

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  preferredUnit: IdDto[]
}

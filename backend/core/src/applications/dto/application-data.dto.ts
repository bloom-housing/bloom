import { OmitType } from "@nestjs/swagger"
import { ApplicationData } from "../entities/application-data.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { AddressUpdateDto } from "../../shared/dto/address.dto"
import { DemographicsUpdateDto } from "./demographics.dto"
import { AccessbilityUpdateDto } from "./accessibility.dto"
import { AlternateContactUpdateDto } from "./alternate-contact.dto"
import { ApplicantUpdateDto } from "./applicant.dto"
import { HouseholdMemberUpdateDto } from "./household-member.dto"

export class ApplicationDataCreateDto extends OmitType(ApplicationData, [
  "id",
  "createdAt",
  "updatedAt",
  "applicant",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics",
  "householdMembers",
]) {
  @Expose()
  @ValidateNested()
  @Type(() => ApplicantUpdateDto)
  applicant: ApplicantUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  mailingAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  alternateAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AlternateContactUpdateDto)
  alternateContact: AlternateContactUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AccessbilityUpdateDto)
  accessibility: AccessbilityUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => DemographicsUpdateDto)
  demographics: DemographicsUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => HouseholdMemberUpdateDto)
  householdMembers: HouseholdMemberUpdateDto[]
}

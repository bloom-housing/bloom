import { OmitType } from "@nestjs/swagger"
import { ApplicationData } from "../entities/application-data.entity"
import { Expose } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { AddressUpdateDto } from "../../shared/dto/address.dto"
import { DemographicsUpdateDto } from "./demographics.dto"
import { AccessbilityUpdateDto } from "./accessibility.dto"
import { AlternateContactUpdateDto } from "./alternate-contact.dto"
import { ApplicantUpdateDto } from "./applicant.dto"

export class ApplicationDataCreateDto extends OmitType(ApplicationData, [
  "id",
  "createdAt",
  "updatedAt",
  "applicant",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics"
]) {
  @Expose()
  @ValidateNested()
  applicant: ApplicantUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  mailingAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  alternateAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  alternateContact: AlternateContactUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  accessibility: AccessbilityUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  demographics: DemographicsUpdateDto
}

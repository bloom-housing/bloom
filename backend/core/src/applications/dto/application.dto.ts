import { OmitType } from "@nestjs/swagger"
import { ArrayMaxSize, IsDefined, ValidateNested } from "class-validator"
import { Application } from "../entities/application.entity"
import { Expose, plainToClass, Transform, Type } from "class-transformer"
import { IdDto } from "../../shared/dto/id.dto"
import { ApplicantDto } from "./applicant.dto"
import { AddressDto } from "../../shared/dto/address.dto"
import { AlternateContactDto } from "./alternate-contact.dto"
import { DemographicsDto } from "./demographics.dto"
import { HouseholdMemberDto } from "./household-member.dto"
import { AccessibilityDto } from "./accessibility.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"

export class ApplicationDto extends OmitType(Application, [
  "listing",
  "listingId",
  "user",
  "userId",
  "applicant",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics",
  "householdMembers",
  "flagged",
  "preferredUnit",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantDto)
  applicant: ApplicantDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  @Transform(
    (value, obj) => {
      return plainToClass(IdDto, { id: obj.listingId })
    },
    { toClassOnly: true }
  )
  listing: IdDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  @Transform(
    (value, obj) => {
      return obj.userId ? plainToClass(IdDto, { id: obj.userId }) : undefined
    },
    { toClassOnly: true }
  )
  user?: IdDto

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMemberDto)
  householdMembers: HouseholdMemberDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitTypeDto)
  preferredUnit: UnitTypeDto[]
}

import { Listing } from "../entities/listing.entity"
import { Expose, Transform, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import moment from "moment"
import {
  PreferenceCreateDto,
  PreferenceDto,
  PreferenceUpdateDto,
} from "../../preferences/dto/preference.dto"
import { OmitType } from "@nestjs/swagger"
import { IdDto } from "../../shared/dto/id.dto"
import { PropertyDto } from "../../property/dto/property.dto"
import { AddressCreateDto, AddressDto, AddressUpdateDto } from "../../shared/dto/address.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UserBasicDto } from "../../user/dto/user.dto"
import { ListingStatus } from "../types/listing-status-enum"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"

export class ListingDto extends OmitType(Listing, [
  "applications",
  "applicationAddress",
  "applicationFlaggedSets",
  "applicationPickUpAddress",
  "leasingAgents",
  "leasingAgentAddress",
  "preferences",
  "property",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceDto)
  preferences: PreferenceDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => PropertyDto)
  property: PropertyDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationAddress: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationPickUpAddress: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  leasingAgentAddress: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UserBasicDto)
  leasingAgents?: UserBasicDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => JurisdictionDto)
  jurisdiction?: JurisdictionDto

  @Expose()
  @Transform((_value, listing) => {
    if (moment(listing.applicationDueDate).isBefore()) {
      listing.status = ListingStatus.closed
    }

    return listing.status
  })
  status: ListingStatus
}

export class ListingCreateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "preferences",
  "property",
  "applicationAddress",
  "applicationPickUpAddress",
  "leasingAgentAddress",
  "leasingAgents",
  "urlSlug",
  "showWaitlist",
  "jurisdiction",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceCreateDto)
  preferences: PreferenceCreateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  property: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationAddress: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationPickUpAddress: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  leasingAgentAddress: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgents?: IdDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdiction?: IdDto
}

export class ListingUpdateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "preferences",
  "property",
  "applicationAddress",
  "applicationPickUpAddress",
  "leasingAgentAddress",
  "urlSlug",
  "leasingAgents",
  "showWaitlist",
  "jurisdiction",
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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceUpdateDto)
  preferences: PreferenceUpdateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  property: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  applicationAddress: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  applicationPickUpAddress: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  leasingAgentAddress: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgents?: IdDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdiction?: IdDto
}

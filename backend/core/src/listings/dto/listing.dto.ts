import { Listing } from "../entities/listing.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"

import {
  PreferenceCreateDto,
  PreferenceDto,
  PreferenceUpdateDto,
} from "../../preferences/dto/preference.dto"
import { AssetCreateDto, AssetDto, AssetUpdateDto } from "../../assets/dto/asset.dto"
import {
  ApplicationMethodCreateDto,
  ApplicationMethodDto,
  ApplicationMethodUpdateDto,
} from "../../application-methods/dto/application-method.dto"
import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import {
  ListingEventCreateDto,
  ListingEventDto,
  ListingEventUpdateDto,
} from "../../listing-events/dto/listing-events.dto"
import { IdDto } from "../../lib/id.dto"
import { PropertyDto } from "../../property/dto/property.dto"
import { AddressCreateDto, AddressUpdateDto } from "../../shared/dto/address.dto"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class ListingDto extends OmitType(Listing, [
  "applicationMethods",
  "assets",
  "preferences",
  "property",
  "events",
  "applications",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodDto)
  applicationMethods: ApplicationMethodDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetDto)
  assets: AssetDto[]

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventDto)
  events: ListingEventDto[]

  @Exclude()
  @ApiHideProperty()
  applications
}

export class ListingCreateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "applicationMethods",
  "assets",
  "preferences",
  "property",
  "events",
  "applications",
  "applicationAddress",
  "applicationPickUpAddress",
  "leasingAgentAddress",
  "urlSlug",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodCreateDto)
  applicationMethods: ApplicationMethodCreateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreateDto)
  assets: AssetCreateDto[]

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventCreateDto)
  events: ListingEventCreateDto[]

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
}

export class ListingUpdateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "applicationMethods",
  "assets",
  "preferences",
  "property",
  "events",
  "applications",
  "applicationAddress",
  "applicationPickUpAddress",
  "leasingAgentAddress",
  "urlSlug",
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
  @Type(() => ApplicationMethodUpdateDto)
  applicationMethods: ApplicationMethodUpdateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetUpdateDto)
  assets: AssetUpdateDto[]

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventUpdateDto)
  events: ListingEventUpdateDto[]

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
}

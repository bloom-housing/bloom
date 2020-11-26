import { Listing } from "../entity/listing.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"

import {
  PreferenceCreateDto,
  PreferenceDto,
  PreferenceUpdateDto,
} from "../preferences/preference.dto"
import { AssetCreateDto, AssetDto, AssetUpdateDto } from "../assets/asset.dto"
import {
  ApplicationMethodCreateDto,
  ApplicationMethodDto,
  ApplicationMethodUpdateDto,
} from "../application-methods/application-method.dto"
import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import {
  ListingEventCreateDto,
  ListingEventDto,
  ListingEventUpdateDto,
} from "../listing-events/listing-events.dto"
import { IdDto } from "../lib/id.dto"
import { PropertyDto } from "../property/property.dto"
import { AddressCreateDto, AddressUpdateDto } from "../shared/dto/address.dto"

export class ListingDto extends OmitType(Listing, [
  "applicationMethods",
  "assets",
  "preferences",
  "property",
  "events",
  "applications",
] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ApplicationMethodDto)
  applicationMethods: ApplicationMethodDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AssetDto)
  assets: AssetDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PreferenceDto)
  preferences: PreferenceDto[]

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => PropertyDto)
  property: PropertyDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
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
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ApplicationMethodCreateDto)
  applicationMethods: ApplicationMethodCreateDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AssetCreateDto)
  assets: AssetCreateDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PreferenceCreateDto)
  preferences: PreferenceCreateDto[]

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => IdDto)
  property: IdDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ListingEventCreateDto)
  events: ListingEventCreateDto[]

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressCreateDto)
  applicationAddress: AddressCreateDto | null

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressCreateDto)
  applicationPickUpAddress: AddressCreateDto | null

  @Expose()
  @IsOptional()
  @ValidateNested()
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
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ApplicationMethodUpdateDto)
  applicationMethods: ApplicationMethodUpdateDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AssetUpdateDto)
  assets: AssetUpdateDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PreferenceUpdateDto)
  preferences: PreferenceUpdateDto[]

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => IdDto)
  property: IdDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ListingEventUpdateDto)
  events: ListingEventUpdateDto[]

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  applicationAddress: AddressUpdateDto | null

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  applicationPickUpAddress: AddressUpdateDto | null

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  leasingAgentAddress: AddressUpdateDto | null
}

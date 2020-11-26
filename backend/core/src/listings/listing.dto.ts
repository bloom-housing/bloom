import { Listing } from "../entity/listing.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"

import { PreferenceDto } from "../preferences/preference.dto"
import { AssetDto } from "../assets/asset.dto"
import { ApplicationMethodDto } from "../application-methods/application-method.dto"
import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { ListingEventDto } from "../listing-events/listing-events.dto"
import { IdDto } from "../lib/id.dto"
import { PropertyDto } from "../property/property.dto"
import { AddressUpdateDto } from "../shared/dto/address.dto"

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
  @Type(() => IdDto)
  applicationMethods: IdDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  assets: IdDto[]

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  preferences: IdDto[]

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => IdDto)
  property: IdDto

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  events: IdDto[]

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

export class ListingUpdateDto extends ListingCreateDto {
  @Expose()
  @IsUUID()
  id: string
}

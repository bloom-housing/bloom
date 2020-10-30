import { Listing } from "../entity/listing.entity"
import { ListingsResponseStatus } from "./listings.service"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsEnum, IsUUID, ValidateNested } from "class-validator"

import { PreferenceDto } from "../preferences/preference.dto"
import { AssetDto } from "../assets/asset.dto"
import { ApplicationMethodDto } from "../application-methods/application-method.dto"
import { UnitDto } from "../units/unit.dto"
import { OmitType } from "@nestjs/swagger"
import { ListingEventDto } from "../listing-events/listing-events.dto"
import { IdDto } from "../lib/id.dto"

export class ListingDto extends OmitType(Listing, [
  "applicationMethods",
  "assets",
  "preferences",
  "units",
  "events",
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
  @ValidateNested({ each: true })
  @Type(() => UnitDto)
  units: UnitDto[]

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ListingEventDto)
  events: ListingEventDto[]
}

export class ListingExtendedDto {
  @Expose()
  @IsEnum(ListingsResponseStatus)
  status: ListingsResponseStatus
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ListingDto)
  listings: ListingDto[]
  @Expose()
  amiCharts: any
}

export class ListingCreateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "applicationMethods",
  "assets",
  "preferences",
  "units",
  "events",
] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type((applicationMethods) => IdDto)
  applicationMethods: IdDto[]
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type((asset) => IdDto)
  assets: IdDto[]
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type((preference) => IdDto)
  preferences: IdDto[]
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type((unit) => IdDto)
  units: IdDto[]
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type((unit) => IdDto)
  events: IdDto[]
}

export class ListingUpdateDto extends ListingCreateDto {
  @Expose()
  @IsUUID()
  id: string
}

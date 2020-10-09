import { OmitType } from "@nestjs/swagger"
import { ListingDto } from "./listing.dto"
import { Expose, Type } from "class-transformer"
import { IdDto } from "../lib/id.dto"
import { IsDefined, ValidateNested } from "class-validator"

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

import { OmitType } from "@nestjs/swagger"
import { ListingEvent } from "../entities/listing-event.entity"
import { Expose, Type } from "class-transformer"
import { IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AssetCreateDto, AssetUpdateDto } from "../../assets/dto/asset.dto"

export class ListingEventDto extends OmitType(ListingEvent, ["listing"]) {}
export class ListingEventCreateDto extends OmitType(ListingEventDto, [
  "id",
  "createdAt",
  "updatedAt",
  "file",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  file?: AssetCreateDto
}

export class ListingEventUpdateDto extends OmitType(ListingEventDto, [
  "id",
  "createdAt",
  "updatedAt",
  "file",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetUpdateDto)
  file?: AssetUpdateDto
}

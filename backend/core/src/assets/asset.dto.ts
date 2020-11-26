import { Asset } from "../entity/asset.entity"
import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"

export class AssetDto extends OmitType(Asset, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"]) {}

export class AssetUpdateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"]) {
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
}

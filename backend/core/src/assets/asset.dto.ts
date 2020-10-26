import { Asset } from "../entity/asset.entity"
import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose } from "class-transformer"
import { IsUUID } from "class-validator"

export class AssetDto extends OmitType(Asset, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"]) {}

export class AssetUpdateDto extends AssetCreateDto {
  @Expose()
  @IsUUID()
  id: string
}

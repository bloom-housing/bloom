import { Asset } from "../entity/asset.entity"
import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"

export class AssetDto extends OmitType(Asset, ["listing"] as const) {}

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"]) {}

export class AssetUpdateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"]) {
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
}

import { OmitType } from "@nestjs/swagger"
import { Asset } from "../entities/asset.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class AssetDto extends OmitType(Asset, [] as const) {}

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"] as const) {}
export class AssetUpdateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"] as const) {
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

export class CreatePresignedUploadMetadataDto {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  parametersToSign: Record<string, string>
}

export class CreatePresignedUploadMetadataResponseDto {
  @Expose()
  signature: string
}

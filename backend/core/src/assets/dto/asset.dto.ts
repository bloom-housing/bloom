import { OmitType } from "@nestjs/swagger"
import { Asset } from "../entities/asset.entity"
import { Expose } from "class-transformer"
import { IsDefined } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class AssetDto extends OmitType(Asset, [] as const) {}

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"] as const) {}

export class CreatePresignedUploadMetadataDto {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  parametersToSign: Record<string, string>
}

export class CreatePresignedUploadMetadataResponseDto {
  @Expose()
  signature: string
}

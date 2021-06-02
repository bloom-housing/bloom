import { OmitType } from "@nestjs/swagger"
import { Asset } from "../entities/asset.entity"
import { Expose } from "class-transformer"
import { Column } from "typeorm"
import { IsOptional, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class AssetDto extends OmitType(Asset, [] as const) {}

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"] as const) {}

export class CreatePresignedUploadMetadataDto {
  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  publicId: string

  @Column({ type: "text" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  eager?: string
}

export class CreatePresignedUploadMetadataResponseDto {
  @Expose()
  timestamp: string

  @Expose()
  signature: string
}

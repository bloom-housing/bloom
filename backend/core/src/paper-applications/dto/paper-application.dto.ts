import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { PaperApplication } from "../entities/paper-application.entity"
import { AssetCreateDto, AssetDto, AssetUpdateDto } from "../../assets/dto/asset.dto"

export class PaperApplicationDto extends OmitType(PaperApplication, [
  "applicationMethod",
  "file",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  file?: AssetDto | null
}

export class PaperApplicationCreateDto extends OmitType(PaperApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
  "file",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  file?: AssetCreateDto | null
}

export class PaperApplicationUpdateDto extends OmitType(PaperApplicationDto, [
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
  file?: AssetUpdateDto | null
}

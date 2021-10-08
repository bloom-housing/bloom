import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsArray, IsDate, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Jurisdiction } from "../entities/jurisdiction.entity"
import { IdDto } from "../../shared/dto/id.dto"

export class JurisdictionDto extends OmitType(Jurisdiction, ["programs"] as const) {
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(1024, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  programs: IdDto[]
}

export class JurisdictionCreateDto extends OmitType(JurisdictionDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class JurisdictionUpdateDto extends OmitType(JurisdictionDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {
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

import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsArray, IsString, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Jurisdiction } from "../entities/jurisdiction.entity"
import { IdDto } from "../../shared/dto/id.dto"
import { IdNameDto } from "../../shared/dto/idName.dto"

export class JurisdictionDto extends OmitType(Jurisdiction, [
  "preferences",
  "programs",
  "admins",
] as const) {
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(1024, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  programs: IdDto[]

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(1024, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  preferences: IdDto[]
}

export class JurisdictionSlimDto extends IdNameDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  publicUrl: string
}

import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitGroup } from "../entities/unit-group.entity"
import {
  UnitGroupAmiLevelCreateDto,
  UnitGroupAmiLevelDto,
  UnitGroupAmiLevelUpdateDto,
} from "./unit-group-ami-level.dto"
import { IdDto } from "../../shared/dto/id.dto"

export class UnitGroupDto extends OmitType(UnitGroup, [
  "listing",
  "unitType",
  "amiLevels",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitTypeDto)
  unitType: UnitTypeDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupAmiLevelDto)
  amiLevels: UnitGroupAmiLevelDto[]
}

export class UnitGroupCreateDto extends OmitType(UnitGroupDto, [
  "id",
  "unitType",
  "amiLevels",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  unitType: IdDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupAmiLevelCreateDto)
  amiLevels: UnitGroupAmiLevelCreateDto[]
}
export class UnitGroupUpdateDto extends OmitType(UnitGroupCreateDto, ["amiLevels"] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupAmiLevelUpdateDto)
  amiLevels: UnitGroupAmiLevelUpdateDto[]
}

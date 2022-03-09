import { OmitType } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"
import { AmiChart } from "src/ami-charts/entities/ami-chart.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitGroupAmiLevel } from "../entities/unit-group-ami-level.entity"

export class UnitGroupAmiLevelDto extends OmitType(UnitGroupAmiLevel, [
  "unitGroup",
  "amiChart",
] as const) {}

export class UnitGroupAmiLevelCreateDto extends OmitType(UnitGroupAmiLevelDto, ["id"] as const) {}

export class UnitGroupAmiLevelUpdateDto extends OmitType(UnitGroupAmiLevelCreateDto, [] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string
}

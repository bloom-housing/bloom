import { OmitType } from "@nestjs/swagger"
import { UnitAmiChartOverride } from "../entities/unit-ami-chart-override.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class UnitAmiChartOverrideDto extends OmitType(UnitAmiChartOverride, [] as const) {}

export class UnitAmiChartOverrideCreateDto extends OmitType(UnitAmiChartOverrideDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class UnitAmiChartOverrideUpdateDto extends OmitType(UnitAmiChartOverrideDto, [
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

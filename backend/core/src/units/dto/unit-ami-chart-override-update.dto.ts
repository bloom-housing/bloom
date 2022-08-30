import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitAmiChartOverrideDto } from "./unit-ami-chart-override.dto"

export class UnitAmiChartOverrideUpdateDto extends OmitType(UnitAmiChartOverrideDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string
}

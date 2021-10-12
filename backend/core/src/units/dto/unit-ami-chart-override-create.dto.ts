import { OmitType } from "@nestjs/swagger"
import { UnitAmiChartOverrideDto } from "./unit-ami-chart-override.dto"

export class UnitAmiChartOverrideCreateDto extends OmitType(UnitAmiChartOverrideDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

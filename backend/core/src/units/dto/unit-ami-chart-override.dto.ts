import { OmitType } from "@nestjs/swagger"
import { UnitAmiChartOverride } from "../entities/unit-ami-chart-override.entity"

export class UnitAmiChartOverrideDto extends OmitType(UnitAmiChartOverride, [] as const) {}

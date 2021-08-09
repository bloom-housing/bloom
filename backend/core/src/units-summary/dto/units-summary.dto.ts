import { OmitType } from "@nestjs/swagger"
import { UnitsSummary } from "../entities/units-summary.entity"

export class UnitsSummaryDto extends OmitType(UnitsSummary, [] as const) {}
export class UnitsSummaryCreateDto extends OmitType(UnitsSummaryDto, [] as const) {}
export class UnitsSummaryUpdateDto extends OmitType(UnitsSummaryDto, [] as const) {}

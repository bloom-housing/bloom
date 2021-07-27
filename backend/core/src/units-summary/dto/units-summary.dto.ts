import { OmitType } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitsSummary } from "../entities/units-summary.entity"

export class UnitsSummaryDto extends OmitType(UnitsSummary, [
  "listing",
  "unitType",
  "priorityType",
] as const) {}

export class UnitsSummaryCreateDto extends OmitType(UnitsSummaryDto, ["id"] as const) {}
export class UnitsSummaryUpdateDto extends OmitType(UnitsSummaryCreateDto, [] as const) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}

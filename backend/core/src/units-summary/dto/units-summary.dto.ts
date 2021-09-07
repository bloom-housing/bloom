import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitsSummary } from "../entities/units-summary.entity"

export class UnitsSummaryDto extends OmitType(UnitsSummary, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class UnitsSummaryCreateDto extends OmitType(UnitsSummaryDto, ["id"] as const) {}
export class UnitsSummaryUpdateDto extends OmitType(UnitsSummaryCreateDto, [] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string
}

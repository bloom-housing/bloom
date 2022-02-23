import { OmitType } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitsSummaryAmiLevel } from "../entities/units-summary-ami-level.entity"

export class UnitsSummaryAmiLevelDto extends OmitType(UnitsSummaryAmiLevel, ["unitsSummary", "amiChart"] as const) {

}

export class UnitsSummaryAmiLevelCreateDto extends OmitType(UnitsSummaryAmiLevelDto, ["id"] as const) {
}

export class UnitsSummaryAmiLevelUpdateDto extends OmitType(UnitsSummaryAmiLevelCreateDto, [] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string
}

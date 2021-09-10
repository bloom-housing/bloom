import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsString, IsUUID, ValidateNested } from "class-validator"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitsSummary } from "../entities/units-summary.entity"

export class UnitsSummaryDto extends OmitType(UnitsSummary, ["listing", "unitType"] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  listing: IdDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  unitType: IdDto
}

export class UnitsSummaryCreateDto extends OmitType(UnitsSummaryDto, ["id"] as const) {}
export class UnitsSummaryUpdateDto extends OmitType(UnitsSummaryCreateDto, [] as const) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}

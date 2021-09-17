import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { IsOptional, IsUUID, ValidateNested } from "class-validator"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitsSummary } from "../entities/units-summary.entity"

export class UnitsSummaryDto extends OmitType(UnitsSummary, ["listing", "unitType"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitTypeDto)
  unitType: UnitTypeDto
}

export class UnitsSummaryCreateDto extends OmitType(UnitsSummaryDto, ["id"] as const) {}
export class UnitsSummaryUpdateDto extends OmitType(UnitsSummaryCreateDto, [] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string
}

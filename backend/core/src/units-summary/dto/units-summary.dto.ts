import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitsSummary } from "../entities/units-summary.entity"
import {
  UnitsSummaryAmiLevelCreateDto,
  UnitsSummaryAmiLevelDto,
  UnitsSummaryAmiLevelUpdateDto
} from "./units-summary-ami-level.dto"
import { IdDto } from "../../shared/dto/id.dto"

export class UnitsSummaryDto extends OmitType(UnitsSummary, ["listing", "unitType", "amiLevels"] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitTypeDto)
  unitType: UnitTypeDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryAmiLevelDto)
  amiLevels: UnitsSummaryAmiLevelDto[]
}

export class UnitsSummaryCreateDto extends OmitType(UnitsSummaryDto, ["id", "unitType", "amiLevels"] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  unitType: IdDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryAmiLevelCreateDto)
  amiLevels: UnitsSummaryAmiLevelCreateDto[]
}
export class UnitsSummaryUpdateDto extends OmitType(UnitsSummaryCreateDto, ["amiLevels"] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id?: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryAmiLevelUpdateDto)
  amiLevels: UnitsSummaryAmiLevelUpdateDto[]
}

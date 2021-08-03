import { Expose, Type } from "class-transformer"
import { IsDefined, IsString, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitSummary } from "./unit-summary"
import { UnitSummaryByAMI } from "./unit-summary-by-ami"
import { HMI } from "./hmi"
import { ApiProperty } from "@nestjs/swagger"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"
import { UnitAccessibilityPriorityType } from "../../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"

export class UnitsSummarized {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: [UnitTypeDto] })
  unitTypes: UnitTypeDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: [UnitAccessibilityPriorityType] })
  priorityTypes: UnitAccessibilityPriorityType[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty()
  amiPercentages: string[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummary)
  @ApiProperty({ type: [UnitSummary] })
  byUnitTypeAndRent: UnitSummary[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummary)
  @ApiProperty({ type: [UnitSummary] })
  byUnitType: UnitSummary[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummaryByAMI)
  @ApiProperty({ type: [UnitSummaryByAMI] })
  byAMI: UnitSummaryByAMI[]

  @Expose()
  @ApiProperty({ type: HMI })
  hmi: HMI
}

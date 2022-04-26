import { Expose, Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitGroupSummary } from "./unit-group-summary"
import { HouseholdMaxIncomeSummary } from "./household-max-income-summary"
import { ApiProperty } from "@nestjs/swagger"

export class UnitSummaries {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupSummary)
  @ApiProperty({ type: [UnitGroupSummary] })
  unitGroupSummary: UnitGroupSummary[]

  @Expose()
  @ApiProperty({ type: HouseholdMaxIncomeSummary })
  householdMaxIncomeSummary: HouseholdMaxIncomeSummary
}

import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitGroupSummary } from './unit-group-summary.dto';
import { HouseholdMaxIncomeSummary } from './household-max-income-summary.dto';

export class UnitGroupsSummarized {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupSummary)
  @ApiProperty({ type: [UnitGroupSummary] })
  unitGroupSummary: UnitGroupSummary[];

  @Expose()
  @ApiProperty({ type: HouseholdMaxIncomeSummary })
  householdMaxIncomeSummary: HouseholdMaxIncomeSummary;
}

import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitSummary } from './unit-summary-get.dto';
import { UnitSummaryByAMI } from './unit-summary-by-ami-get.dto';
import { HMI } from './hmi-get.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UnitType } from '../unit-types/unit-type.dto';
import { UnitAccessibilityPriorityType } from '../unit-accessibility-priority-types/unit-accessibility-priority-type-get.dto';

export class UnitsSummarized {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: [UnitType] })
  unitTypes?: UnitType[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: [UnitAccessibilityPriorityType] })
  priorityTypes?: UnitAccessibilityPriorityType[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty()
  amiPercentages?: string[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummary)
  @ApiProperty({ type: [UnitSummary] })
  byUnitTypeAndRent?: UnitSummary[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummary)
  @ApiProperty({ type: [UnitSummary] })
  byUnitType?: UnitSummary[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummaryByAMI)
  @ApiProperty({ type: [UnitSummaryByAMI] })
  byAMI?: UnitSummaryByAMI[];

  @Expose()
  @ApiProperty({ type: HMI })
  hmi?: HMI;
}

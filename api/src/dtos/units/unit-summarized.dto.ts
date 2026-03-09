import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UnitAccessibilityPriorityTypeEnum } from '../../enums/units/accessibility-priority-type-enum';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitSummary } from './unit-summary.dto';
import { UnitSummaryByAMI } from './unit-summary-by-ami.dto';
import { HMI } from './hmi.dto';
import { UnitType } from '../unit-types/unit-type.dto';

export class UnitsSummarized {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: [UnitType] })
  unitTypes?: UnitType[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({
    enum: UnitAccessibilityPriorityTypeEnum,
    enumName: 'UnitAccessibilityPriorityTypeEnum',
    isArray: true,
  })
  priorityTypes?: UnitAccessibilityPriorityTypeEnum[];

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

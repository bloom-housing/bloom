import { Expose, Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitSummary } from './unit-summary-get.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UnitSummaryByAMI {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  percent: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitSummary)
  @ApiProperty({ type: [UnitSummary] })
  byUnitType: UnitSummary[];
}

import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { HMIColumns } from './household-max-income-columns.dto';

export class HouseholdMaxIncomeSummary {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => HMIColumns)
  @ApiProperty({ type: HMIColumns })
  columns: HMIColumns;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => HMIColumns)
  @ApiProperty({ type: [HMIColumns] })
  rows: HMIColumns[];
}

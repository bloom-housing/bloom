import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';
import { FrequencyData } from './data-explorer-report-frequency.dto';

export class SubsidyFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Section 8',
    description: 'Subsidy or voucher type',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  subsidyType: string;
}

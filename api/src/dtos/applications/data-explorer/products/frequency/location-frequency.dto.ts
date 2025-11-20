import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';
import { FrequencyData } from './data-explorer-report-frequency.dto';

export class LocationFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Oakland',
    description: 'Residential location',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  location: string;
}

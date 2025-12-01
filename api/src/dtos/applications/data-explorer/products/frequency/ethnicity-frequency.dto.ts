import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';
import { FrequencyData } from './data-explorer-report-frequency.dto';

export class EthnicityFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Hispanic or Latino',
    description: 'Ethnicity category',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  ethnicity: string;
}

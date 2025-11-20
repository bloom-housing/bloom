import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';
import { FrequencyData } from './data-explorer-report-frequency.dto';

export class RaceFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Asian',
    description: 'Race category',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  race: string;
}

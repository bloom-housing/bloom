import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';
import { FrequencyData } from './data-explorer-report-frequency.dto';

export class AgeFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: '25-34',
    description: 'Age range',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  age: string;
}

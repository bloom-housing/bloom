import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';
import { FrequencyData } from './data-explorer-report-frequency.dto';

export class LanguageFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'English',
    description: 'Language preference',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  language: string;
}

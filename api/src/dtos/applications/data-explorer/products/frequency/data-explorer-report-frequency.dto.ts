import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../../enums/shared/validation-groups-enum';

export class FrequencyData {
  @Expose()
  @ApiProperty({
    type: Number,
    example: 120,
    description: 'Count of occurrences',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  count: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 0.1,
    description: 'Percentage of total',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  percentage?: number;
}

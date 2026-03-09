import { Expose } from 'class-transformer';
import { BaseFilter } from '../shared/base-filter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PropertyFilterParams extends BaseFilter {
  @Expose()
  @ApiPropertyOptional({
    example: 'uuid',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdiction?: string;
}

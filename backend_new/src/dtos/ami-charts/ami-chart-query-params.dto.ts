import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AmiChartQueryParams {
  @Expose()
  @ApiPropertyOptional({
    name: 'jurisdictionId',
    type: String,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string;
}

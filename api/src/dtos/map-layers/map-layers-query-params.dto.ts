import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class MapLayersQueryParams {
  @Expose()
  @ApiPropertyOptional({
    name: 'jurisdictionId',
    type: String,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string;
}

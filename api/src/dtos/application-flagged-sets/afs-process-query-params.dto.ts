import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AfsProcessQueryParams {
  @Expose()
  @ApiPropertyOptional()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  listingId?: string;

  @Expose()
  @ApiPropertyOptional()
  force?: boolean;
}

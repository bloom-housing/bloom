import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { Expose } from 'class-transformer';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AgencyQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string;
}

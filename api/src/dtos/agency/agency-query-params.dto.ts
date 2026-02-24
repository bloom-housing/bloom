import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { AgencyFilterParams } from './agency-filter-params.dto';

export class AgencyQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: [String],
    items: {
      $ref: getSchemaPath(AgencyFilterParams),
    },
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => AgencyFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: AgencyFilterParams[];
}

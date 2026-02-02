import { Expose, Type } from 'class-transformer';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { PropertyFilterParams } from './property-filter-params.dto';

export class PropertyQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    example: 'search',
  })
  @MinLength(3, {
    message: 'Search must be at least 3 characters',
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    items: {
      $ref: getSchemaPath(PropertyFilterParams),
    },
    example: [{ $comparison: '=', jurisdiction: 'uuid' }],
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => PropertyFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: PropertyFilterParams[];
}

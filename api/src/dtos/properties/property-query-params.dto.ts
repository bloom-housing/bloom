import { Expose, Type } from 'class-transformer';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, MinLength, ValidateNested } from 'class-validator';
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
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => PropertyFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: PropertyFilterParams[];
}

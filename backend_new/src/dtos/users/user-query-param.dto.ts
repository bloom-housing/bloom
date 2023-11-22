import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { UserFilterParams } from './user-filter-params.dto';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    name: 'filter',
    type: [String],
    items: {
      $ref: getSchemaPath(UserFilterParams),
    },
    example: { isPartner: true },
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: UserFilterParams[];

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'search',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(3, {
    message: 'Search must be at least 3 characters',
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string;
}

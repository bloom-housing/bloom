import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { UserFilterParams } from './user-filter-params.dto';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UserOrderByKeys } from '../../enums/listings/order-by-enum';
import { OrderByEnum } from '../../enums/shared/order-by-enum';
import { OrderQueryParamValidator } from '../../utilities/order-by-validator';

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

  @Expose()
  @ApiPropertyOptional({
    enum: UserOrderByKeys,
    enumName: 'UserOrderByKeys',
    example: ['isApproved'],
    default: ['isApproved'],
    isArray: true,
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(UserOrderByKeys, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @Validate(OrderQueryParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  orderBy?: UserOrderByKeys[];

  @Expose()
  @ApiPropertyOptional({
    enum: OrderByEnum,
    enumName: 'OrderByEnum',
    example: ['desc'],
    default: ['desc'],
    isArray: true,
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Transform(({ value }) => {
    return value ? value.map((val) => val.toLowerCase()) : undefined;
  })
  @IsEnum(OrderByEnum, { groups: [ValidationsGroupsEnum.default], each: true })
  @Validate(OrderQueryParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  orderDir?: OrderByEnum[];
}

import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ListingFilterParams } from './listings-filter-params.dto';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingOrderByKeys } from '../../enums/listings/order-by-enum';
import { OrderByEnum } from '../../enums/shared/order-by-enum';
import { OrderQueryParamValidator } from '../../utilities/order-by-validator';

export class ListingsQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiProperty({
    name: 'filter',
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(ListingFilterParams),
    },
    example: { $comparison: '=', status: 'active', name: 'Coliseum' },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: ListingFilterParams[];

  @Expose()
  @ApiProperty({
    name: 'view',
    required: false,
    type: String,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  view?: string;

  @Expose()
  @ApiProperty({
    name: 'orderBy',
    required: false,
    enumName: 'OrderByFieldsEnum',
    example: '["updatedAt"]',
    isArray: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFilterParams)
  @IsEnum(ListingOrderByKeys, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @Validate(OrderQueryParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  orderBy?: ListingOrderByKeys[];

  @Expose()
  @ApiProperty({
    enum: OrderByEnum,
    example: '["desc"]',
    default: '["desc"]',
    required: false,
    isArray: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(OrderByEnum, { groups: [ValidationsGroupsEnum.default], each: true })
  @Validate(OrderQueryParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  orderDir?: OrderByEnum[];

  @Expose()
  @ApiProperty({
    type: String,
    example: 'search',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(3, {
    message: 'Search must be at least 3 characters',
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string;
}

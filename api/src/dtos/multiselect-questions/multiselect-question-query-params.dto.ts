import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { MultiselectQuestionFilterParams } from './multiselect-question-filter-params.dto';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { SearchStringLengthCheck } from '../../decorators/search-string-length-check.decorator';
import { MultiselectQuestionOrderByKeys } from '../../enums/multiselect-questions/order-by-enum';
import { MultiselectQuestionViews } from '../../enums/multiselect-questions/view-enum';
import { OrderByEnum } from '../../enums/shared/order-by-enum';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { OrderQueryParamValidator } from '../../utilities/order-by-validator';

export class MultiselectQuestionQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: [String],
    items: {
      $ref: getSchemaPath(MultiselectQuestionFilterParams),
    },
    example: { $comparison: '=', applicationSection: 'programs' },
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectQuestionFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: MultiselectQuestionFilterParams[];

  @Expose()
  @ApiPropertyOptional({
    enum: MultiselectQuestionOrderByKeys,
    enumName: 'MultiselectQuestionOrderByKeys',
    example: ['status'],
    default: ['status'],
    isArray: true,
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(MultiselectQuestionOrderByKeys, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @Validate(OrderQueryParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  orderBy?: MultiselectQuestionOrderByKeys[];

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

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'search',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @SearchStringLengthCheck('search', {
    message: 'Search must be at least 3 characters',
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string;

  @Expose()
  @ApiPropertyOptional({
    enum: MultiselectQuestionViews,
    enumName: 'MultiselectQuestionViews',
    example: 'base',
  })
  @IsEnum(MultiselectQuestionViews, {
    groups: [ValidationsGroupsEnum.default],
  })
  view?: MultiselectQuestionViews;
}

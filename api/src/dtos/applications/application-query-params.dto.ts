import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApplicationOrderByKeys } from '../../enums/applications/order-by-enum';
import { OrderByEnum } from '../../enums/shared/order-by-enum';
import { SearchStringLengthCheck } from '../../decorators/search-string-length-check.decorator';
import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
export class ApplicationQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'listingId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string;

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
    type: String,
    example: 'userId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string;

  @Expose()
  @ApiPropertyOptional({
    enum: ApplicationOrderByKeys,
    enumName: 'ApplicationOrderByKeys',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationOrderByKeys, {
    groups: [ValidationsGroupsEnum.default],
  })
  @Transform((value: TransformFnParams) =>
    value?.value
      ? ApplicationOrderByKeys[value.value]
        ? ApplicationOrderByKeys[value.value]
        : value
      : ApplicationOrderByKeys.createdAt,
  )
  orderBy?: ApplicationOrderByKeys;

  @Expose()
  @ApiPropertyOptional({
    enum: OrderByEnum,
    enumName: 'OrderByEnum',
    example: 'DESC',
    default: 'DESC',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(OrderByEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @Transform((value: TransformFnParams) =>
    value?.value ? value.value.toLowerCase() : OrderByEnum.DESC,
  )
  order?: OrderByEnum;

  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: TransformFnParams) => {
      switch (value?.value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return undefined;
      }
    },
    { toClassOnly: true },
  )
  markedAsDuplicate?: boolean;
}

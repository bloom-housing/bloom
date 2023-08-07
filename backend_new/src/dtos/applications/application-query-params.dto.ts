import { PaginationAllowsAllQueryParams } from '../shared/pagination.dto';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApplicationOrderByKeys } from '../../enums/applications/order-by-enum';
import { OrderByEnum } from '../../enums/shared/order-by-enum';
import { SearchStringLengthCheck } from '../../decorators/search-string-length-check.decorator';

export class ApplicationQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'listingId',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'search',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @SearchStringLengthCheck('search', {
    message: 'Search must be at least 3 characters',
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'userId',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string;

  @Expose()
  @ApiProperty({
    enum: ApplicationOrderByKeys,
    enumName: 'ApplicationOrderByKeys',
    example: 'createdAt',
    default: 'createdAt',
    required: false,
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
  @ApiProperty({
    enum: OrderByEnum,
    enumName: 'OrderByEnum',
    example: 'DESC',
    default: 'DESC',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(OrderByEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @Transform((value: TransformFnParams) =>
    value?.value ? value.value : OrderByEnum.DESC,
  )
  order?: OrderByEnum;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
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

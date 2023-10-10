import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Expose,
  Transform,
  TransformFnParams,
  Type,
  ClassConstructor,
} from 'class-transformer';
import {
  IsNumber,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PaginationMeta {
  @Expose()
  @ApiProperty()
  currentPage: number;

  @Expose()
  @ApiProperty()
  itemCount: number;

  @Expose()
  @ApiProperty()
  itemsPerPage: number;

  @Expose()
  @ApiProperty()
  totalItems: number;

  @Expose()
  @ApiProperty()
  totalPages: number;
}

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
}

export function PaginationFactory<T>(
  classType: ClassConstructor<T>,
): ClassConstructor<Pagination<T>> {
  class PaginationHost implements Pagination<T> {
    @ApiProperty({ type: () => classType, isArray: true })
    @Expose()
    @Type(() => classType)
    items: T[];

    @Expose()
    @ApiProperty({ type: () => PaginationMeta })
    @Type(() => classType)
    meta: PaginationMeta;
  }
  return PaginationHost;
}

export class PaginationQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    default: 1,
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: TransformFnParams) => (value?.value ? parseInt(value.value) : 1),
    {
      toClassOnly: true,
    },
  )
  page?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 10,
    default: 10,
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: TransformFnParams) => (value?.value ? parseInt(value.value) : 10),
    {
      toClassOnly: true,
    },
  )
  limit?: number;
}

export class PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    default: 1,
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: TransformFnParams) => (value?.value ? parseInt(value.value) : 1),
    {
      toClassOnly: true,
    },
  )
  page?: number;

  @Expose()
  @ApiPropertyOptional({
    type: "number | 'all'",
    example: 10,
    default: 10,
  })
  @IsNumberOrAll({
    message: 'Limit must be a number or "all"',
    groups: [ValidationsGroupsEnum.default],
  })
  @Transform(
    (value: TransformFnParams) => {
      if (value?.value === 'all') {
        return value.value;
      }
      return value?.value ? parseInt(value.value) : 10;
    },
    {
      toClassOnly: true,
    },
  )
  limit?: number | 'all';
}

/*
  validates if the value is either a number or the string 'all'
*/
function IsNumberOrAll(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNumberOrAll',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return (
            (typeof value === 'number' && !isNaN(value)) ||
            (typeof value === 'string' && value === 'all')
          );
        },
      },
    });
  };
}

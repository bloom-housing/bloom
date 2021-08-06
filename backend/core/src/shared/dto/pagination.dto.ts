import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IPaginationMeta } from "nestjs-typeorm-paginate/dist/interfaces"
import { Expose, Transform, Type } from "class-transformer"
import { IsNumber, IsOptional, registerDecorator, ValidationOptions } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"
import { ClassType } from "class-transformer/ClassTransformer"

export class PaginationMeta implements IPaginationMeta {
  @Expose()
  currentPage: number
  @Expose()
  itemCount: number
  @Expose()
  itemsPerPage: number
  @Expose()
  totalItems: number
  @Expose()
  totalPages: number
}

export interface Pagination<T> {
  items: T[]
  meta: PaginationMeta
}

export function PaginationFactory<T>(classType: ClassType<T>): ClassType<Pagination<T>> {
  class PaginationHost implements Pagination<T> {
    @ApiProperty({ type: () => classType, isArray: true })
    @Expose()
    @Type(() => classType)
    items: T[]
    @Expose()
    meta: PaginationMeta
  }
  return PaginationHost
}

export class PaginationQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => (value ? parseInt(value) : 1), {
    toClassOnly: true,
  })
  page?: number

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => (value ? parseInt(value) : 10), {
    toClassOnly: true,
  })
  limit?: number
}

export class PaginationAllowsAllQueryParams {
  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => (value ? parseInt(value) : 1), {
    toClassOnly: true,
  })
  page?: number

  @Expose()
  @ApiPropertyOptional({
    type: "number | 'all'",
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberOrAll({ message: "test", groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: string | undefined) => {
      if (value === "all") {
        return value
      }
      return value ? parseInt(value) : 10
    },
    {
      toClassOnly: true,
    }
  )
  limit?: number | "all"
}

function IsNumberOrAll(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNumberOrAll",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return (
            (typeof value === "number" && !isNaN(value)) ||
            (typeof value === "string" && value === "all")
          )
        },
      },
    })
  }
}

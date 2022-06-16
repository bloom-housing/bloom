import { PaginationAllowsAllQueryParams } from "../../shared/dto/pagination.dto"
import { Expose, Type } from "class-transformer"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { ListingFilterParams } from "./listing-filter-params"
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { OrderParam } from "../../applications/types/order-param"
import { OrderQueryParamValidator } from "../validators/order-query-param-validator"
export class ListingsQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiProperty({
    name: "filter",
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(ListingFilterParams),
    },
    example: { $comparison: "=", status: "active", name: "Coliseum" },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: ListingFilterParams[]

  @Expose()
  @ApiProperty({
    name: "view",
    required: false,
    type: String,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  view?: string

  @Expose()
  @ApiProperty({
    name: "orderBy",
    required: false,
    enumName: "OrderByFieldsEnum",
    example: '["updatedAt"]',
    isArray: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFilterParams)
  @IsEnum(OrderByFieldsEnum, { groups: [ValidationsGroupsEnum.default], each: true })
  @Validate(OrderQueryParamValidator, { groups: [ValidationsGroupsEnum.default] })
  orderBy?: OrderByFieldsEnum[]

  @Expose()
  @ApiProperty({
    enum: OrderParam,
    example: '["DESC"]',
    default: '["DESC"]',
    required: false,
    isArray: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(OrderParam, { groups: [ValidationsGroupsEnum.default], each: true })
  @Validate(OrderQueryParamValidator, { groups: [ValidationsGroupsEnum.default] })
  orderDir?: OrderParam[]

  @Expose()
  @ApiProperty({
    type: String,
    example: "search",
    required: false,
    isArray: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(3, {
    message: "Search must be at least 3 characters",
    groups: [ValidationsGroupsEnum.default],
  })
  search?: string
}

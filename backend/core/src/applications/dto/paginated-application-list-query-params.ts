import { PaginationQueryParams } from "../../shared/dto/pagination.dto"
import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { OrderByParam } from "../types/order-by-param"
import { OrderParam } from "../types/order-param"

export class PaginatedApplicationListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: "search",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  search?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: "userId",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string

  @Expose()
  @ApiProperty({
    enum: Object.keys(OrderByParam),
    example: "createdAt",
    default: "createdAt",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(Object.values(OrderByParam), { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) =>
    value ? (OrderByParam[value] ? OrderByParam[value] : value) : OrderByParam.createdAt
  )
  orderBy?: OrderByParam

  @Expose()
  @ApiProperty({
    enum: OrderParam,
    example: "DESC",
    default: "DESC",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(Object.keys(OrderParam), { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => (value ? value : OrderParam.DESC))
  order?: OrderParam

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: string | undefined) => {
      switch (value) {
        case "true":
          return true
        case "false":
          return false
        default:
          return undefined
      }
    },
    { toClassOnly: true }
  )
  markedAsDuplicate?: boolean
}

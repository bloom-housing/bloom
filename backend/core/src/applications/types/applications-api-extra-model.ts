import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { OrderByParam } from "./order-by-param"
import { OrderParam } from "./order-param"

export class ApplicationsApiExtraModel {
  @Expose()
  @ApiProperty({
    enum: Object.keys(OrderByParam),
    example: "createdAt",
    default: "createdAt",
    required: false,
  })
  orderBy?: OrderByParam

  @Expose()
  @ApiProperty({
    enum: OrderParam,
    example: "DESC",
    default: "DESC",
    required: false,
  })
  order?: OrderParam
}

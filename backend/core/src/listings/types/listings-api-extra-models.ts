import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { OrderByFieldsEnum } from "./listing-orderby-enum"
import { OrderParam } from "../../applications/types/order-param"

export class ListingsApiExtraModels {
  @Expose()
  @ApiProperty({
    name: "orderBy",
    required: false,
    enum: OrderByFieldsEnum,
    enumName: "OrderByFieldsEnum",
    example: '["updatedAt"]',
    isArray: true,
  })
  orderBy: OrderByFieldsEnum

  @Expose()
  @ApiProperty({
    enum: OrderParam,
    example: '["DESC"]',
    default: '["DESC"]',
    required: false,
    isArray: true,
  })
  order: OrderParam
}

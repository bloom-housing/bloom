import { ApiPropertyOptional } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional } from "class-validator"
import { Operators } from "../filter"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

export class BaseWhereParams {
  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: "=",
    required: false,
    default: "=",
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  operator?: Operators
}

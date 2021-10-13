import { PaginationAllowsAllQueryParams } from "../../shared/dto/pagination.dto"
import { Expose, Type } from "class-transformer"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UserFilterParams } from "./user-filter-params"

export class UserListQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiProperty({
    name: "filter",
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(UserFilterParams),
    },
    example: { $comparison: "=", isPartner: true },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: UserFilterParams[]
}

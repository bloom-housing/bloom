import { ListingsQueryParams } from "../dto/listings-query-params"
import { Expose, Type } from "class-transformer"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { IsOptional, IsArray, ArrayMaxSize, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { CombinedListingFilterParams } from "./combined-listing-filter-params"

export class CombinedListingsQueryParams extends ListingsQueryParams {
  @Expose()
  @ApiProperty({
    name: "filter",
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(CombinedListingFilterParams),
    },
    example: { $comparison: "=", status: "active", name: "Paseo" },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => CombinedListingFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: CombinedListingFilterParams[]
}

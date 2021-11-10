import { Expose, Type } from "class-transformer"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { PreferencesFilterParams } from "./preferences-filter-params"

export class PreferencesListQueryParams {
  @Expose()
  @ApiProperty({
    name: "filter",
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(PreferencesFilterParams),
    },
    example: { $comparison: "=", jurisdiction: "uuid" },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => PreferencesFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: PreferencesFilterParams[]
}

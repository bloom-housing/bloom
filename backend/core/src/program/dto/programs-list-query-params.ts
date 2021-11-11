import { Expose, Type } from "class-transformer"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ProgramsFilterParams } from "./programs-filter-params"

export class ProgramsListQueryParams {
  @Expose()
  @ApiProperty({
    name: "filter",
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(ProgramsFilterParams),
    },
    example: { $comparison: "=", jurisdiction: "uuid" },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => ProgramsFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: ProgramsFilterParams[]
}

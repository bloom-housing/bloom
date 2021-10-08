import { ApiProperty } from "@nestjs/swagger"
import { Expose, Transform } from "class-transformer"
import { IsEnum, IsOptional, IsBoolean } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

// Add other comparisons as needed (>, <, etc)
export enum Compare {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "<=" = "<=",
  "NA" = "NA", // For filters that don't use the comparison param
}

export class BaseFilter {
  @Expose()
  @ApiProperty({
    enum: Object.keys(Compare),
    example: "=",
    default: Compare["="],
  })
  @IsEnum(Compare, { groups: [ValidationsGroupsEnum.default] })
  $comparison: Compare

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @Transform(
    (value?: string) => {
      return value === "true"
    },
    { toClassOnly: true }
  )
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  $include_nulls?: boolean
}

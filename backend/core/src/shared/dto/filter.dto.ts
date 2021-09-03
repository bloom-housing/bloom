import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

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
  $comparison?: Compare | Compare[]
}

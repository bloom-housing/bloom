import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

// Add other comparisons as needed (>, <, etc)
export enum Compare {
  "=" = "=",
  "<>" = "<>",
}
export class BaseFilter {
  @Expose()
  @ApiProperty({
    enum: Object.keys(Compare),
    example: "=",
    default: Compare["="],
  })
  $comparison: Compare | Compare[]
}

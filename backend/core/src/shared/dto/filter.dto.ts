import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsEnum, IsNumber } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

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
  @IsEnum(Compare)
  // @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  $comparison: Compare | Compare[]
}

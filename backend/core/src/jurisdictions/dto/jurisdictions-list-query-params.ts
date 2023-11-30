import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class JurisdictionsListParams {
  @Expose()
  @ApiProperty({
    type: Array,
    example: ["Bay Area", "Contra Costa"],
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  names?: string[]
}

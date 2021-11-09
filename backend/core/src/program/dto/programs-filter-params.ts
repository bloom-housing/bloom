import { BaseFilter } from "../../shared/dto/filter.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ProgramFilterKeys } from "./program-filter-keys"

export class ProgramsFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: "uuid",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ProgramFilterKeys.jurisdiction]?: string
}

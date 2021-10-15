import { BaseFilter } from "../../shared/dto/filter.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { PreferenceFilterKeys } from "./preference-filter-keys"

export class PreferencesFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: "Coliseum",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [PreferenceFilterKeys.jurisdiction]?: string
}

import { BaseFilter } from "../../shared/dto/filter.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UserFilterKeys } from "../types/user-filter-keys"

export class UserFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [UserFilterKeys.isPartner]?: boolean
}

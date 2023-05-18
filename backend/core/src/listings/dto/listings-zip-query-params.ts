import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ListingsZipQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  timeZone?: string
}

import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class MapLayersQueryParams {
  @Expose()
  @ApiProperty({
    name: "jurisdictionId",
    required: false,
    type: String,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string
}

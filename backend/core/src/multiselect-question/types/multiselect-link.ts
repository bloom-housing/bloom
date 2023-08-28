import { Expose } from "class-transformer"
import { IsString, IsUrl } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"

export class MultiselectLink {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  title: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @IsUrl({ require_protocol: true }, { groups: [ValidationsGroupsEnum.default] })
  url: string
}

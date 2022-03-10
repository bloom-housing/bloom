import { Expose } from "class-transformer"
import { IsDefined, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"

export class MinMaxString {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString()
  @ApiProperty()
  min: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString()
  @ApiProperty()
  max: string
}

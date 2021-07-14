import { IsString, MaxLength } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ConfirmDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  token: string
}

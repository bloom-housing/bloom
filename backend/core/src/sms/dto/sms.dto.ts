import { Expose } from "class-transformer"
import { IsEmail, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class SmsDto {
  @Expose()
  @IsString()
  body: string

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  userEmail: string
}

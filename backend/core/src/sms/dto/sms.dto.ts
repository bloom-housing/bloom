import { Expose } from "class-transformer"
import { IsPhoneNumber, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class SmsDto {
  @Expose()
  @IsString()
  body: string

  @Expose()
  @IsPhoneNumber("US", { groups: [ValidationsGroupsEnum.default] })
  phoneNumber: string
}

import { IsEmail, IsString } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"

export class LoginDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  email: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  password: string
}

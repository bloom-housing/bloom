import { Expose } from "class-transformer"
import { IsEmail, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"

export class GetMfaInfoDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  email: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  password: string
}

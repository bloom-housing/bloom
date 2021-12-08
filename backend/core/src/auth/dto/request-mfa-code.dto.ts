import { Expose } from "class-transformer"
import { IsEmail, IsEnum, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"
import { MfaType } from "../types/mfa-type"

export class RequestMfaCodeDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  email: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  password: string

  @Expose()
  @IsEnum(MfaType, { groups: [ValidationsGroupsEnum.default] })
  mfaType: MfaType
}

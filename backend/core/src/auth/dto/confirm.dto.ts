import { IsOptional, IsString, Matches, MaxLength } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { passwordRegex } from "../../shared/password-regex"

export class ConfirmDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  token: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: "passwordTooWeak",
    groups: [ValidationsGroupsEnum.default],
  })
  password?: string
}

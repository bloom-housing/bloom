import { IsString, Matches, MaxLength } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Match } from "../../shared/decorators/match.decorator"
import { passwordRegex } from "../../shared/password-regex"

export class UpdatePasswordDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: "passwordTooWeak",
    groups: [ValidationsGroupsEnum.default],
  })
  password: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Match("password")
  passwordConfirmation: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  token: string
}

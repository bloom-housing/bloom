import { IsString, Matches, MaxLength } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class UpdatePasswordDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  password: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Matches("password")
  passwordConfirmation: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  token: string
}

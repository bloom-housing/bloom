import { IsString, Matches } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class UpdatePasswordDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  password: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches("password")
  passwordConfirmation: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  token: string
}

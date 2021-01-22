import { IsEmail, IsString, IsOptional } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class ForgotPasswordDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  email: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}

export class ForgotPasswordResponseDto {
  @Expose()
  message: string
}

import { IsEmail, IsString, IsOptional, MaxLength } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ForgotPasswordDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  email: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}

export class ForgotPasswordResponseDto {
  @Expose()
  message: string
}

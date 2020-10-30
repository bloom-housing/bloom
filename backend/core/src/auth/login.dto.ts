import { IsEmail, IsString } from "class-validator"
import { Expose } from "class-transformer"

export class LoginDto {
  @Expose()
  @IsEmail()
  email: string

  @Expose()
  @IsString()
  password: string
}

export class LoginResponseDto {
  @Expose()
  accessToken: string
}

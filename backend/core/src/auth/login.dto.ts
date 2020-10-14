import { IsEmail, IsString } from "class-validator"
import { Expose } from "class-transformer"

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class LoginResponseDto {
  @Expose()
  accessToken: string
  constructor(loginResponseDto: Partial<LoginResponseDto>) {
    Object.assign(this, loginResponseDto)
  }
}

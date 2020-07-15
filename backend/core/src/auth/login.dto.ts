import { IsEmail, IsString } from "class-validator"

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class LoginResponseDto {
  @IsString()
  accessToken: string
}

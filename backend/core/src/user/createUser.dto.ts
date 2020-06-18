import { IsNotEmpty, IsEmail, IsISO8601 } from "class-validator"

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  firstName: string

  middleName: string

  @IsNotEmpty()
  lastName: string

  @IsISO8601()
  dob: Date

  @IsNotEmpty()
  password: string
}

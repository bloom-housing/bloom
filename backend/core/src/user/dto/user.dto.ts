import { OmitType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class UserDto extends OmitType(User, [
  "passwordHash",
  "applications",
  "isAdmin",
  "isLeasingAgent",
  "listings",
] as const) {}

export class UserDtoWithAccessToken extends UserDto {
  @Expose()
  accessToken: string
}

export class UserCreateDto extends OmitType(UserDto, ["id", "createdAt", "updatedAt"] as const) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  password: string
}

export class UserUpdateDto extends OmitType(UserDto, ["email"] as const) {}

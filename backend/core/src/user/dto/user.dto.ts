import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Exclude, Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class UserDto extends OmitType(User, [
  "passwordHash",
  "applications",
  "isAdmin",
  "isLeasingAgent",
] as const) {
  @Exclude()
  @ApiHideProperty()
  passwordHash

  @Exclude()
  @ApiHideProperty()
  isAdmin
}

export class UserDtoWithAccessToken extends UserDto {
  @Expose()
  accessToken: string
}

export class UserCreateDto extends OmitType(UserDto, ["id", "createdAt", "updatedAt"] as const) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  password: string
}

export class UserUpdateDto extends OmitType(UserDto, ["email"] as const) {
  //TODO check if removing this allows user to change email
  @Exclude()
  @ApiHideProperty()
  email
}

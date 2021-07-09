import { OmitType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Expose, Type } from "class-transformer"
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { Match } from "../../shared/decorators/match.decorator"
import { passwordRegex } from "../../shared/password-regex"

export class UserDto extends OmitType(User, [
  "applications",
  "isAdmin",
  "leasingAgentInListings",
  "passwordHash",
  "resetToken",
  "confirmationToken",
] as const) {
  @Expose()
  @IsOptional()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgentInListings?: IdDto[] | null
}

export class UserBasicDto extends OmitType(User, [
  "applications",
  "dob",
  "isAdmin",
  "leasingAgentInListings",
  "passwordHash",
  "roles",
  "confirmationToken",
  "resetToken",
] as const) {}

export class UserDtoWithAccessToken extends UserDto {
  @Expose()
  accessToken: string
}

export class EmailDto {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  email: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}

export class UserCreateDto extends OmitType(UserDto, [
  "id",
  "confirmedAt",
  "createdAt",
  "updatedAt",
  "leasingAgentInListings",
  "roles",
] as const) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: "passwordTooWeak",
    groups: [ValidationsGroupsEnum.default],
  })
  password: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Match("password", { groups: [ValidationsGroupsEnum.default] })
  passwordConfirmation: string

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @Match("email", { groups: [ValidationsGroupsEnum.default] })
  emailConfirmation: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}

export class UserUpdateDto extends OmitType(UserDto, [
  "id",
  "createdAt",
  "updatedAt",
  "leasingAgentInListings",
  "roles",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: "passwordTooWeak",
    groups: [ValidationsGroupsEnum.default],
  })
  password?: string

  @Expose()
  @ValidateIf((o) => o.password, { groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  currentPassword?: string
}

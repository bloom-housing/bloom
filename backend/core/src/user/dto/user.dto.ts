import { OmitType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Expose, Type } from "class-transformer"
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { IdDto } from "../../shared/dto/id.dto"

export class UserDto extends OmitType(User, [
  "applications",
  "isAdmin",
  "leasingAgentInListings",
  "passwordHash",
  "resetToken",
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
] as const) {}

export class UserDtoWithAccessToken extends UserDto {
  @Expose()
  accessToken: string
}

export class UserCreateDto extends OmitType(UserDto, [
  "id",
  "confirmedAt",
  "confirmationToken",
  "createdAt",
  "updatedAt",
  "leasingAgentInListings",
  "roles",
] as const) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, { message: "password too weak" })
  password: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Matches("password")
  passwordConfirmation: string

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @Matches("email")
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
  "email",
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
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  dob: Date
}

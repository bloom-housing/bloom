import { PickType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Expose, Type } from "class-transformer"
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { passwordRegex } from "../../shared/password-regex"
import { IdDto } from "../../shared/dto/id.dto"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"

export class UserProfileUpdateDto extends PickType(User, [
  "id",
  "firstName",
  "middleName",
  "lastName",
  "dob",
  "createdAt",
  "updatedAt",
  "language",
  "phoneNumber",
] as const) {
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

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdictions: IdDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  newEmail?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null
}

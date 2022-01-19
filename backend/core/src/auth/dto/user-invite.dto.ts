import { OmitType } from "@nestjs/swagger"
import { UserDto } from "./user.dto"
import { Expose, Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { UserRolesCreateDto } from "./user-roles-create.dto"

export class UserInviteDto extends OmitType(UserDto, [
  "id",
  "createdAt",
  "updatedAt",
  "roles",
  "jurisdictions",
  "leasingAgentInListings",
  "mfaEnabled",
  "passwordUpdatedAt",
  "passwordValidForDays",
  "lastLoginAt",
  "failedLoginAttemptsCount",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserRolesCreateDto)
  roles: UserRolesCreateDto | null

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdictions: IdDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgentInListings?: IdDto[] | null
}

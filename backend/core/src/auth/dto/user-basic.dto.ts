import { OmitType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UserRolesDto } from "./user-roles.dto"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { IdDto } from "../../shared/dto/id.dto"

export class UserBasicDto extends OmitType(User, [
  "leasingAgentInListings",
  "passwordHash",
  "confirmationToken",
  "resetToken",
  "roles",
  "jurisdictions",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UserRolesDto)
  roles: UserRolesDto

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => JurisdictionDto)
  jurisdictions: JurisdictionDto[]

  @Expose()
  @IsOptional()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgentInListings?: IdDto[] | null
}

import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { UserRoles } from "../entities/user-roles.entity"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class UserRolesDto extends OmitType(UserRoles, ["isPartner", "isAdmin"] as const) {}

export class UserRolesCreateDto extends OmitType(UserRolesDto, ["jurisdictions"] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdictions: IdDto[]
}

export class UserRolesUpdateDto extends OmitType(UserRolesDto, [] as const) {}

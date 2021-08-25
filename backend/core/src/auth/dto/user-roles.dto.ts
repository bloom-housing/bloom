import { OmitType } from "@nestjs/swagger"
import { UserRoles } from "../entities/user-roles.entity"

export class UserRolesDto extends OmitType(UserRoles, ["user"] as const) {}

export class UserRolesCreateDto extends OmitType(UserRolesDto, [] as const) {}

export class UserRolesUpdateDto extends OmitType(UserRolesDto, [] as const) {}

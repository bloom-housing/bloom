import { OmitType } from "@nestjs/swagger"
import { UserRoles } from "../entities/user-roles.entity"

export class UserRolesDto extends OmitType(UserRoles, ["user"] as const) {}

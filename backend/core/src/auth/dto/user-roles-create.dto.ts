import { OmitType } from "@nestjs/swagger"
import { UserRolesDto } from "./user-roles.dto"

export class UserRolesCreateDto extends OmitType(UserRolesDto, ["user", "userId"] as const) {}

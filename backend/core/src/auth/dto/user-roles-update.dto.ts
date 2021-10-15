import { OmitType } from "@nestjs/swagger"
import { UserRolesDto } from "./user-roles.dto"

export class UserRolesUpdateDto extends OmitType(UserRolesDto, ["user"] as const) {}

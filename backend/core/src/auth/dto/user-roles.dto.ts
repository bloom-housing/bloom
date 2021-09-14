import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IdDto } from "../../shared/dto/id.dto"
import { UserRoles } from "../entities/user-roles.entity"

export class UserRolesDto extends OmitType(UserRoles, ["user"] as const) {
  @Expose()
  @Type(() => IdDto)
  user: IdDto
}

export class UserRolesCreateDto extends OmitType(UserRolesDto, ["user"] as const) {}

export class UserRolesUpdateDto extends OmitType(UserRolesDto, ["user"] as const) {}

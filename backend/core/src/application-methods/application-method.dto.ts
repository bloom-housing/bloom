import { OmitType } from "@nestjs/swagger"
import { ApplicationMethod } from "../entity/application-method.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, ["listing"] as const) {}

export class ApplicationMethodCreateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ApplicationMethodUpdateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
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
}

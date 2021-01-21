import { OmitType } from "@nestjs/swagger"
import { ApplicationFlaggedSet } from "../entities/application-flagged-set.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export class ApplicationFlaggedSetDto extends OmitType(ApplicationFlaggedSet, [
  "ruleName",
] as const) {}

export class ApplicationFlaggedSetCreateDto extends OmitType(ApplicationFlaggedSet, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ApplicationFlaggedSetUpdateDto extends OmitType(ApplicationFlaggedSet, [
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

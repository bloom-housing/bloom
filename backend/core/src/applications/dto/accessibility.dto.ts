import { OmitType } from "@nestjs/swagger"
import { Accessibility } from "../entities/accessibility.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class AccessibilityDto extends Accessibility {}

export class AccessibilityCreateDto extends OmitType(AccessibilityDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class AccessibilityUpdateDto extends OmitType(AccessibilityDto, [
  "id",
  "createdAt",
  "updatedAt",
]) {
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

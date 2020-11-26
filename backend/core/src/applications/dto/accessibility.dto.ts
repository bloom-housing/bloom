import { OmitType } from "@nestjs/swagger"
import { Accessibility } from "../entities/accessibility.entity"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"

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
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsUUID()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsUUID()
  updatedAt?: Date
}

import { OmitType } from "@nestjs/swagger"
import { Accessibility } from "../entities/accessibility.entity"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"

export class AccessbilityUpdateDto extends OmitType(Accessibility, [
  "id",
  "createdAt",
  "updatedAt"
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

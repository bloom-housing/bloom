import { OmitType } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsUUID } from "class-validator"
import { ApplicationPreferences } from "../entities/application-preferences.entity"

export class ApplicationPreferencesDto extends OmitType(ApplicationPreferences, [] as const) {}

export class ApplicationPreferencesCreateDto extends OmitType(ApplicationPreferencesDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ApplicationPreferencesUpdateDto extends OmitType(ApplicationPreferencesDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {
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

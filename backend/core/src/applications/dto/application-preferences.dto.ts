import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { ApplicationPreferences } from "../entities/application-preferences.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

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

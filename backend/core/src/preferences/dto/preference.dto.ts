import { OmitType } from "@nestjs/swagger"
import { Preference } from "../entities/preference.entity"
import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class PreferenceDto extends OmitType(Preference, [
  "listing",
  "listingPreferences",
] as const) {}

export class PreferenceCreateDto extends OmitType(PreferenceDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class PreferenceUpdateDto extends PreferenceCreateDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID()
  id: string
}

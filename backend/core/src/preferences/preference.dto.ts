import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Preference } from "../entity/preference.entity"
import { Exclude, Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"

export class PreferenceDto extends OmitType(Preference, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class PreferenceCreateDto extends OmitType(PreferenceDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class PreferenceUpdateDto extends PreferenceCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}

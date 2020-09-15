import { OmitType } from "@nestjs/swagger"
import { PreferenceDto } from "./preference.dto"

export class PreferenceCreateDto extends OmitType(PreferenceDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

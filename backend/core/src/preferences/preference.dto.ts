import { OmitType } from "@nestjs/swagger"
import { Preference } from "../entity/preference.entity"

export class PreferenceDto extends OmitType(Preference, ["listing"] as const) {}

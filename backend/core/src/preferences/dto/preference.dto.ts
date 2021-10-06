import { OmitType } from "@nestjs/swagger"
import { Preference } from "../entities/preference.entity"

export class PreferenceDto extends OmitType(Preference, ["listingPreferences"] as const) {}

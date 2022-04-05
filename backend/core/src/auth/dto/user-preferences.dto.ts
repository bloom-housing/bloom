import { OmitType } from "@nestjs/swagger"
import { UserPreferences } from "../entities/user-preferences.entity"

export class UserPreferencesDto extends OmitType(UserPreferences, ["user"] as const) {}

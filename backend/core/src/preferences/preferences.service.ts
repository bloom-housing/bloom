import { Preference } from "./entities/preference.entity"
import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { PreferenceCreateDto } from "./dto/preference-create.dto"
import { PreferenceUpdateDto } from "./dto/preference-update.dto"

export class PreferencesService extends AbstractServiceFactory<
  Preference,
  PreferenceCreateDto,
  PreferenceUpdateDto
>(Preference) {}

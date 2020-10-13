import { Preference } from "../entity/preference.entity"
import { PreferenceCreateDto } from "../preferences/preference.create.dto"
import { PreferenceUpdateDto } from "../preferences/preference.update.dto"
import { AbstractServiceFactory } from "../shared/abstract-service"

export class PreferencesService extends AbstractServiceFactory<
  Preference,
  PreferenceCreateDto,
  PreferenceUpdateDto
>(Preference) {}

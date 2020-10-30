import { Preference } from "../entity/preference.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import { PreferenceCreateDto, PreferenceUpdateDto } from "./preference.dto"

export class PreferencesService extends AbstractServiceFactory<
  Preference,
  PreferenceCreateDto,
  PreferenceUpdateDto
>(Preference) {}

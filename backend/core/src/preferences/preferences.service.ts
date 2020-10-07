import { Preference } from "../entity/preference.entity"
import { PreferenceCreateDto } from "../preferences/preference.create.dto"
import { PreferenceUpdateDto } from "../preferences/preference.update.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { AbstractService } from "../shared/abstract-service"
import { Repository } from "typeorm"

export class PreferencesService extends AbstractService<
  Preference,
  PreferenceCreateDto,
  PreferenceUpdateDto
> {
  constructor(@InjectRepository(Preference) protected readonly repository: Repository<Preference>) {
    super(repository)
  }
}

import { Preference } from "../entity/preference.entity"
import { PreferenceCreateDto } from "../preferences/preference.create.dto"
import { plainToClass } from "class-transformer"
import { PreferenceUpdateDto } from "../preferences/preference.update.dto"

export class PreferencesService {
  async list(): Promise<Preference[]> {
    return Preference.find()
  }

  async create(preferenceDto: PreferenceCreateDto): Promise<Preference> {
    const preference = plainToClass(Preference, preferenceDto)
    await preference.save()
    return preference
  }

  async findOne(preferenceId: string): Promise<Preference> {
    return Preference.findOneOrFail({
      where: {
        id: preferenceId,
      },
    })
  }

  async delete(preferenceId: string) {
    await Preference.delete(preferenceId)
  }

  async update(preferenceDto: PreferenceUpdateDto) {
    const preference = await Preference.findOneOrFail({
      where: {
        id: preferenceDto.id,
      },
    })
    Object.assign(preference, preferenceDto)
    await preference.save()
    return preference
  }
}

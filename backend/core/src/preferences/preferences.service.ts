import { Preference } from "./entities/preference.entity"
import { QueryOneOptions } from "../shared/services/abstract-service"
import { PreferenceCreateDto } from "./dto/preference-create.dto"
import { PreferenceUpdateDto } from "./dto/preference-update.dto"
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { assignDefined } from "../shared/assign-defined"
import { addFilters } from "../shared/filter"
import { PreferencesListQueryParams } from "./dto/preferences-list-query-params"
import { PreferencesFilterParams } from "./dto/preferences-filter-params"
import { jurisdictionFilterTypeToFieldMap } from "./dto/jurisdictionFilterTypeToFieldMap"

export class PreferencesService {
  constructor(@InjectRepository(Preference) private readonly repository: Repository<Preference>) {}

  list(params?: PreferencesListQueryParams): Promise<Preference[]> {
    const qb = this.repository
      .createQueryBuilder("preferences")
      .leftJoin("preferences.jurisdictions", "preferenceJurisdictions")
      .select(["preferences", "preferenceJurisdictions.id"])

    if (params.filter) {
      addFilters<Array<PreferencesFilterParams>, typeof jurisdictionFilterTypeToFieldMap>(
        params.filter,
        jurisdictionFilterTypeToFieldMap,
        qb
      )
    }
    return qb.getMany()
  }

  async create(dto: PreferenceCreateDto): Promise<Preference> {
    return await this.repository.save(dto)
  }

  async findOne(queryOneOptions: QueryOneOptions<Preference>): Promise<Preference> {
    const obj = await this.repository.findOne(queryOneOptions)
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: PreferenceUpdateDto) {
    const obj = await this.repository.findOne({
      where: {
        id: dto.id,
      },
    })
    if (!obj) {
      throw new NotFoundException()
    }
    assignDefined(obj, dto)
    await this.repository.save(obj)
    return obj
  }
}

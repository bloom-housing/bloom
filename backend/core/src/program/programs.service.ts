import { Program } from "./entities/program.entity"
import { QueryOneOptions } from "../shared/services/abstract-service"
import { ProgramCreateDto } from "./dto/program-create.dto"
import { ProgramUpdateDto } from "./dto/program-update.dto"
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { assignDefined } from "../shared/assign-defined"
import { addFilters } from "../shared/filter"
import { ProgramsListQueryParams } from "./dto/programs-list-query-params"
import { ProgramsFilterParams } from "./dto/programs-filter-params"
import { jurisdictionFilterTypeToFieldMap } from "./dto/jurisdictionFilterTypeToFieldMap"

export class ProgramsService {
  constructor(@InjectRepository(Program) private readonly repository: Repository<Program>) {}

  list(params?: ProgramsListQueryParams): Promise<Program[]> {
    const qb = this.repository
      .createQueryBuilder("preferences")
      .leftJoin("preferences.jurisdictions", "preferenceJurisdictions")
      .select(["preferences", "preferenceJurisdictions.id"])

    if (params.filter) {
      addFilters<Array<ProgramsFilterParams>, typeof jurisdictionFilterTypeToFieldMap>(
        params.filter,
        jurisdictionFilterTypeToFieldMap,
        qb
      )
    }
    return qb.getMany()
  }

  async create(dto: ProgramCreateDto): Promise<Program> {
    return await this.repository.save(dto)
  }

  async findOne(queryOneOptions: QueryOneOptions<Program>): Promise<Program> {
    const obj = await this.repository.findOne(queryOneOptions)
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: ProgramUpdateDto) {
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

import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Jurisdiction } from "../entities/jurisdiction.entity"
import { JurisdictionCreateDto } from "../dto/jurisdiction-create.dto"
import { QueryOneOptions } from "../../shared/services/abstract-service"
import { JurisdictionUpdateDto } from "../dto/jurisdiction-update.dto"
import { assignDefined } from "../../shared/utils/assign-defined"

export class JurisdictionsService {
  constructor(
    @InjectRepository(Jurisdiction)
    private readonly repository: Repository<Jurisdiction>
  ) {}
  joinOptions = {
    alias: "jurisdiction",
    leftJoinAndSelect: {
      programs: "jurisdiction.programs",
      preferences: "jurisdiction.preferences",
    },
  }

  list(): Promise<Jurisdiction[]> {
    return this.repository.find({
      join: this.joinOptions,
    })
  }

  async create(dto: JurisdictionCreateDto): Promise<Jurisdiction> {
    return await this.repository.save(dto)
  }

  async findOne(queryOneOptions: QueryOneOptions<Jurisdiction>): Promise<Jurisdiction> {
    const obj = await this.repository.findOne({ ...queryOneOptions, join: this.joinOptions })
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: JurisdictionUpdateDto) {
    const obj = await this.repository.findOne({
      where: {
        id: dto.id,
      },
      join: this.joinOptions,
    })
    if (!obj) {
      throw new NotFoundException()
    }
    assignDefined(obj, dto)
    await this.repository.save(obj)
    return obj
  }
}

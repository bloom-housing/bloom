import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyOptions, FindOneOptions, In, Repository } from "typeorm"
import { Jurisdiction } from "../entities/jurisdiction.entity"
import { JurisdictionCreateDto } from "../dto/jurisdiction-create.dto"
import { JurisdictionUpdateDto } from "../dto/jurisdiction-update.dto"
import { assignDefined } from "../../shared/utils/assign-defined"
import { JurisdictionsListParams } from "../dto/jurisdictions-list-query-params"

export class JurisdictionsService {
  constructor(
    @InjectRepository(Jurisdiction)
    private readonly repository: Repository<Jurisdiction>
  ) {}
  joinOptions = {
    alias: "jurisdiction",
    leftJoinAndSelect: {
      multiselectquestions: "jurisdiction.multiselectQuestions",
    },
  }

  async list(queryParams: JurisdictionsListParams): Promise<Jurisdiction[]> {
    const obj = queryParams.names
      ? await this.repository.find({
          where: { name: In([...queryParams.names]) },
          join: this.joinOptions,
        })
      : await this.repository.find({
          join: this.joinOptions,
        })

    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async create(dto: JurisdictionCreateDto): Promise<Jurisdiction> {
    return await this.repository.save(dto)
  }

  async findOne(findOneOptions: FindOneOptions<Jurisdiction>): Promise<Jurisdiction> {
    const obj = await this.repository.findOne({ ...findOneOptions, join: this.joinOptions })
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async findMany(findManyOptions: FindManyOptions<Jurisdiction>): Promise<Jurisdiction[]> {
    const obj = await this.repository.find({ ...findManyOptions, join: this.joinOptions })
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

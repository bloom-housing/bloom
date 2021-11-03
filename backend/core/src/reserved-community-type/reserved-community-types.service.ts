import { QueryOneOptions } from "../shared/services/abstract-service"
import { NotFoundException } from "@nestjs/common"
import { ReservedCommunityType } from "./entities/reserved-community-type.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { assignDefined } from "../shared/assign-defined"
import {
  ReservedCommunityTypeCreateDto,
  ReservedCommunityTypeUpdateDto,
} from "./dto/reserved-community-type.dto"
import { ReservedCommunityTypeListQueryParams } from "./dto/reserved-community-type-list-query-params"

export class ReservedCommunityTypesService {
  constructor(
    @InjectRepository(ReservedCommunityType)
    private readonly repository: Repository<ReservedCommunityType>
  ) {}

  list(queryParams?: ReservedCommunityTypeListQueryParams): Promise<ReservedCommunityType[]> {
    return this.repository.find({
      join: {
        alias: "rct",
        leftJoinAndSelect: { jurisdiction: "rct.jurisdiction" },
      },
      where: (qb) => {
        if (queryParams.jurisdictionName) {
          qb.where("jurisdiction.name = :jurisdictionName", queryParams)
        }
      },
    })
  }

  async create(dto: ReservedCommunityTypeCreateDto): Promise<ReservedCommunityType> {
    return await this.repository.save(dto)
  }

  async findOne(
    queryOneOptions: QueryOneOptions<ReservedCommunityType>
  ): Promise<ReservedCommunityType> {
    const obj = await this.repository.findOne(queryOneOptions)
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: ReservedCommunityTypeUpdateDto) {
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

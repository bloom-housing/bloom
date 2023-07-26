import { NotFoundException } from "@nestjs/common"
import { ReservedCommunityType } from "./entities/reserved-community-type.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm"
import {
  ReservedCommunityTypeCreateDto,
  ReservedCommunityTypeUpdateDto,
} from "./dto/reserved-community-type.dto"
import { ReservedCommunityTypeListQueryParams } from "./dto/reserved-community-type-list-query-params"
import { assignDefined } from "../shared/utils/assign-defined"

export class ReservedCommunityTypesService {
  constructor(
    @InjectRepository(ReservedCommunityType)
    private readonly repository: Repository<ReservedCommunityType>
  ) {}

  list(queryParams?: ReservedCommunityTypeListQueryParams): Promise<ReservedCommunityType[]> {
    const whereClause: FindOptionsWhere<ReservedCommunityType> = {}
    if (queryParams.jurisdictionName) {
      whereClause.jurisdiction = { name: queryParams.jurisdictionName }
    }
    return this.repository.find({
      join: {
        alias: "rct",
        leftJoinAndSelect: { jurisdiction: "rct.jurisdiction" },
      },
      where: whereClause,
    })
  }

  async create(dto: ReservedCommunityTypeCreateDto): Promise<ReservedCommunityType> {
    return await this.repository.save(dto)
  }

  async findOne(
    findOneOptions: FindOneOptions<ReservedCommunityType>
  ): Promise<ReservedCommunityType> {
    const obj = await this.repository.findOne(findOneOptions)
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

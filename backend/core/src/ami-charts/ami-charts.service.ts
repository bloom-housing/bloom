import { AmiChart } from "./entities/ami-chart.entity"
import { AmiChartCreateDto, AmiChartUpdateDto } from "./dto/ami-chart.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { QueryOneOptions } from "../shared/services/abstract-service"
import { NotFoundException } from "@nestjs/common"
import { assignDefined } from "../shared/assign-defined"
import { AmiChartListQueryParams } from "./dto/ami-chart-list-query-params"

export class AmiChartsService {
  constructor(
    @InjectRepository(AmiChart)
    private readonly repository: Repository<AmiChart>
  ) {}

  list(queryParams?: AmiChartListQueryParams): Promise<AmiChart[]> {
    return this.repository.find({
      join: {
        alias: "amiChart",
        leftJoinAndSelect: { jurisdiction: "amiChart.jurisdiction" },
      },
      where: (qb) => {
        if (queryParams.jurisdictionName) {
          qb.where("jurisdiction.name = :jurisdictionName", queryParams)
        } else if (queryParams.jurisdictionId) {
          qb.where("jurisdiction.id = :jurisdictionId", queryParams)
        }
      },
    })
  }

  async create(dto: AmiChartCreateDto): Promise<AmiChart> {
    return await this.repository.save(dto)
  }

  async findOne(queryOneOptions: QueryOneOptions<AmiChart>): Promise<AmiChart> {
    const obj = await this.repository.findOne(queryOneOptions)
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: AmiChartUpdateDto) {
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

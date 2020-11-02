import { Inject, Injectable } from "@nestjs/common"
import { Application } from "../entity/application.entity"
import { plainToClass } from "class-transformer"
import {
  ApplicationCreateDto,
  ApplicationsListQueryParams,
  ApplicationUpdateDto,
} from "./application.dto"
import { User } from "../entity/user.entity"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"
import { applicationFormattingMetadataAggregateFactory } from "../services/application-formatting-metadata"
import { CsvBuilder } from "../services/csv-builder.service"

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    @InjectRepository(Application) private readonly repository: Repository<Application>,
    private readonly csvBuilder: CsvBuilder
  ) {}

  private async list(listingId: string | null, user?: User) {
    return this.repository.find({
      where: {
        ...(user && { user: { id: user.id } }),
        // Workaround for params.listingId resulting in:
        // listing: {id: undefined}
        // and query responding with 0 applications.
        ...(listingId && { listing: { id: listingId } }),
      },
      relations: ["listing", "user"],
    })
  }

  async listAsCsv(listingId: string | null, includeHeaders: boolean, user?: User) {
    const applications = await this.list(listingId, user)
    return this.csvBuilder.build(
      applications,
      applicationFormattingMetadataAggregateFactory,
      includeHeaders
    )
  }

  async listPaginated(params: ApplicationsListQueryParams, user?: User) {
    return paginate(
      this.repository,
      { limit: params.limit, page: params.page },
      {
        where: {
          ...(user && { user: { id: user.id } }),
          // Workaround for params.listingId resulting in:
          // listing: {id: undefined}
          // and query responding with 0 applications.
          ...(params.listingId && {
            listing: { id: params.listingId },
          }),
        },
        relations: ["listing", "user"],
      }
    )
  }

  async create(applicationCreateDto: ApplicationCreateDto, user?: User) {
    const application = plainToClass(Application, applicationCreateDto)
    application.user = user
    await this.repository.save(application)
    return application
  }

  async findOne(applicationId: string) {
    return await this.repository.findOneOrFail({
      where: {
        id: applicationId,
      },
      relations: ["listing", "user"],
    })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto, existing?: Application) {
    const application =
      existing ||
      (await this.repository.findOneOrFail({
        where: { id: applicationUpdateDto.id },
        relations: ["listing", "user"],
      }))
    Object.assign(application, applicationUpdateDto)
    await this.repository.save(application)
    return application
  }

  async delete(applicationId: string) {
    return await this.repository.delete({ id: applicationId })
  }
}

import { Inject, Injectable } from "@nestjs/common"
import { Application } from "./entities/application.entity"
import { plainToClass } from "class-transformer"
import { ApplicationUpdateDto } from "./dto/application.dto"
import { User } from "../entity/user.entity"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"
import { applicationFormattingMetadataAggregateFactory } from "../services/application-formatting-metadata"
import { CsvBuilder } from "../services/csv-builder.service"
import { ApplicationsListQueryParams } from "./applications.controller"
import { Request } from "express"

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
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
      relations: ["listing", "user", "listing.property"],
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
    const qb = this.repository.createQueryBuilder("application")
    qb.leftJoinAndSelect("application.user", "user")
    qb.leftJoinAndSelect("application.listing", "listing")
    qb.leftJoinAndSelect("listing.property", "property")

    if (user) {
      qb.andWhere("user.id = :userId", { userId: user.id })
    }

    if (params.listingId) {
      qb.andWhere("listing.id = :listingId", { listingId: params.listingId })
    }

    if (params.search) {
      qb.andWhere("to_tsvector('english', application) @@ plainto_tsquery(:search)", {
        search: params.search,
      })
    }

    return paginate(qb, { limit: params.limit, page: params.page })
  }

  async create(applicationCreateDto: ApplicationUpdateDto, user?: User) {
    const application = plainToClass(Application, applicationCreateDto)
    application.user = user
    return await this.repository.save(application)
  }

  async findOne(applicationId: string) {
    return await this.repository.findOneOrFail({
      where: {
        id: applicationId,
      },
      relations: ["listing", "user", "listing.property"],
    })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto, existing?: Application) {
    const application =
      existing ||
      (await this.repository.findOneOrFail({
        where: { id: applicationUpdateDto.id },
        relations: ["listing", "user", "listing.property"],
      }))
    Object.assign(application, applicationUpdateDto)
    await this.repository.save(application)
    return application
  }

  async delete(applicationId: string) {
    return await this.repository.delete({ id: applicationId })
  }
}

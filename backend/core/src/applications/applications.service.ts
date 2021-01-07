import { Inject, Injectable } from "@nestjs/common"
import { Application } from "./entities/application.entity"
import { plainToClass } from "class-transformer"
import { ApplicationUpdateDto } from "./dto/application.dto"
import { User } from "../user/entities/user.entity"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Raw, Repository } from "typeorm"
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
      loadEagerRelations: true,
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
          ...(params.listingId && { listing: { id: params.listingId } }),
          ...(params.search && {
            applicant: Raw(
              () =>
                `to_tsvector('english', concat_ws(' ', "Application__applicant")) @@ plainto_tsquery(:search)`,
              {
                search: params.search,
              }
            ),
          }),
        },
        relations: ["listing", "user", "listing.property"],
      }
    )
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
    return await this.repository.softRemove({ id: applicationId })
  }
}

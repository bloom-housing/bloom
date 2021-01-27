import { Inject, Injectable } from "@nestjs/common"
import { Application } from "./entities/application.entity"
import { ApplicationUpdateDto } from "./dto/application.dto"
import { User } from "../user/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Raw, Repository } from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"
import { ApplicationsListQueryParams } from "./applications.controller"
import { Request } from "express"
import { ApplicationFlaggedSetService } from "../application-flagged-sets/application-flagged-set.service"
import { REQUEST } from "@nestjs/core"
import { CsvBuilder } from "../services/csv-builder.service"

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Application) private readonly repository: Repository<Application>,
    private readonly applicationFlaggedSetService: ApplicationFlaggedSetService,
    private readonly csvBuilder: CsvBuilder
  ) {}

  public async list(listingId: string | null, user?: User) {
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

  async listPaginated(params: ApplicationsListQueryParams) {
    return paginate(
      this.repository,
      { limit: params.limit, page: params.page },
      {
        where: {
          ...(params.userId && { user: { id: params.userId } }),
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
        relations: ["listing", "user"],
      }
    )
  }

  async create(applicationCreateDto: ApplicationUpdateDto, user?: User) {
    const application = await this.repository.save({
      ...applicationCreateDto,
      user,
    })
    await this.applicationFlaggedSetService.handleInsert(application)
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
    return await this.repository.softRemove({ id: applicationId })
  }
}

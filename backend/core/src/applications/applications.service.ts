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
      relations: [
        "listing",
        "user",
        "listing.property",
        "listing.property.buildingAddress",
        "listing.property.units",
        "listing.property.units.amiChart",
        "listing.property.units.amiChart.items",
      ],
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
    const qb = this.repository.createQueryBuilder("application")
    // FIXME This is a temporary fix before switching to using a repository with
    //  to_tsvector. Previously it didn't work because of bugs in TypeORM related to jsonb columns
    // When using querybuild we actually need to specify all the relation that
    // are normally registeredas eager with repository methods.
    qb.leftJoinAndSelect("application.accessibility", "accessibility")
    qb.leftJoinAndSelect("application.alternateAddress", "alternateAddress")
    qb.leftJoinAndSelect("application.alternateContact", "alternateContact")
    qb.leftJoinAndSelect("alternateContact.mailingAddress", "alternateMailingAddress")
    qb.leftJoinAndSelect("application.applicant", "applicant")
    qb.leftJoinAndSelect("applicant.address", "applicantAddress")
    qb.leftJoinAndSelect("applicant.workAddress", "applicantWorkAddress")
    qb.leftJoinAndSelect("application.demographics", "demographics")
    qb.leftJoinAndSelect("application.householdMembers", "householdMembers")
    qb.leftJoinAndSelect("householdMembers.address", "householdMembersAddress")
    qb.leftJoinAndSelect("householdMembers.workAddress", "householdMembersWorkAddress")
    qb.leftJoinAndSelect("application.mailingAddress", "applicationMailingAddress")
    qb.leftJoinAndSelect("application.preferences", "preferences")
    // Not eager relations
    qb.leftJoinAndSelect("application.user", "user")
    qb.leftJoinAndSelect("application.listing", "listing")
    qb.leftJoinAndSelect("listing.property", "property")
    qb.leftJoinAndSelect("property.buildingAddress", "buildingAddress")
    qb.leftJoinAndSelect("property.units", "units")
    qb.leftJoinAndSelect("units.amiChart", "amiChart")
    qb.leftJoinAndSelect("amiChart.items", "amiChartItems")

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

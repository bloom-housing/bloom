import { Inject, Injectable, Scope } from "@nestjs/common"
import { Application } from "./entities/application.entity"
import { ApplicationCreateDto, ApplicationUpdateDto } from "./dto/application.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { paginate, Pagination } from "nestjs-typeorm-paginate"
import { PaginatedApplicationListQueryParams } from "./applications.controller"
import { ApplicationFlaggedSetsService } from "../application-flagged-sets/application-flagged-sets.service"
import { assignDefined } from "../shared/assign-defined"
import { authzActions, AuthzService } from "../auth/authz.service"
import { Request as ExpressRequest } from "express"
import { ListingsService } from "../listings/listings.service"
import { EmailService } from "../shared/email/email.service"
import { REQUEST } from "@nestjs/core"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationsService {
  constructor(
    @Inject(REQUEST) private req: ExpressRequest,
    private readonly applicationFlaggedSetsService: ApplicationFlaggedSetsService,
    private readonly authzService: AuthzService,
    private readonly listingsService: ListingsService,
    private readonly emailService: EmailService,
    @InjectRepository(Application) private readonly repository: Repository<Application>
  ) {}

  public async list(params: PaginatedApplicationListQueryParams) {
    const qb = this._getQb(params)
    const result = await qb.getMany()
    await Promise.all(
      result.map(async (application) => {
        await this.authorizeUserAction(this.req.user, application, authzActions.read)
      })
    )
    return result
  }

  async listPaginated(
    params: PaginatedApplicationListQueryParams
  ): Promise<Pagination<Application>> {
    const qb = this._getQb(params)
    const result = await paginate(qb, { limit: params.limit, page: params.page })
    await Promise.all(
      result.items.map(async (application) => {
        await this.authorizeUserAction(this.req.user, application, authzActions.read)
      })
    )
    return result
  }

  async submit(applicationCreateDto: ApplicationCreateDto) {
    applicationCreateDto.submissionDate = new Date()
    await this.authorizeUserAction(this.req.user, applicationCreateDto, authzActions.submit)
    const application = await this._create(applicationCreateDto)
    return application
  }

  async create(applicationCreateDto: ApplicationCreateDto) {
    await this.authorizeUserAction(this.req.user, applicationCreateDto, authzActions.create)
    return this._create(applicationCreateDto)
  }

  async findOne(applicationId: string) {
    const application = await this.repository.findOneOrFail({
      where: {
        id: applicationId,
      },
    })
    await this.authorizeUserAction(this.req.user, application, authzActions.read)
    return application
  }

  async update(applicationUpdateDto: ApplicationUpdateDto, existing?: Application) {
    const application =
      existing ||
      (await this.repository.findOneOrFail({
        where: { id: applicationUpdateDto.id },
      }))
    await this.authorizeUserAction(this.req.user, application, authzActions.update)
    assignDefined(application, {
      ...applicationUpdateDto,
      id: application.id,
    })

    await this.repository.save(application)
    return application
  }

  async delete(applicationId: string) {
    await this.findOne(applicationId)
    return await this.repository.softRemove({ id: applicationId })
  }

  private _getQb(params: PaginatedApplicationListQueryParams) {
    /**
     * Map used to generate proper parts
     * of query builder.
     */
    const paramsMap = {
      markedAsDuplicate: (qb, { markedAsDuplicate }) =>
        qb.andWhere("application.markedAsDuplicate = :markedAsDuplicate", {
          markedAsDuplicate: markedAsDuplicate,
        }),
      userId: (qb, { userId }) => qb.andWhere("application.user_id = :uid", { uid: userId }),
      listingId: (qb, { listingId }) =>
        qb.andWhere("application.listing_id = :lid", { lid: listingId }),
      orderBy: (qb, { orderBy, order }) => qb.orderBy(orderBy, order),
      search: (qb, { search }) =>
        qb.andWhere(
          `to_tsvector('english', REGEXP_REPLACE(concat_ws(' ', applicant, alternateContact.emailAddress), '[_]|[-]', '/', 'g')) @@ to_tsquery(CONCAT(CAST(plainto_tsquery(REGEXP_REPLACE(:search, '[_]|[-]', '/', 'g')) as text), ':*'))`,
          {
            search,
          }
        ),
    }

    // --> Build main query
    const qb = this.repository.createQueryBuilder("application")
    qb.leftJoinAndSelect("application.applicant", "applicant")
    qb.leftJoinAndSelect("applicant.address", "applicant_address")
    qb.leftJoinAndSelect("applicant.workAddress", "applicant_workAddress")
    qb.leftJoinAndSelect("application.alternateAddress", "alternateAddress")
    qb.leftJoinAndSelect("application.mailingAddress", "mailingAddress")
    qb.leftJoinAndSelect("application.alternateContact", "alternateContact")
    qb.leftJoinAndSelect("alternateContact.mailingAddress", "alternateContact_mailingAddress")
    qb.leftJoinAndSelect("application.accessibility", "accessibility")
    qb.leftJoinAndSelect("application.demographics", "demographics")
    qb.leftJoinAndSelect("application.householdMembers", "householdMembers")
    qb.leftJoinAndSelect("householdMembers.address", "householdMembers_address")
    qb.leftJoinAndSelect("householdMembers.workAddress", "householdMembers_workAddress")
    qb.where("application.id IS NOT NULL")

    // --> Build additional query builder parts
    Object.keys(paramsMap).forEach((paramKey) => {
      // e.g. markedAsDuplicate can be false and wouldn't be applied here
      if (params[paramKey] !== undefined) {
        paramsMap[paramKey](qb, params)
      }
    })
    return qb
  }
  private async _create(applicationCreateDto: ApplicationUpdateDto) {
    const application = await this.repository.save({
      ...applicationCreateDto,
      user: this.req.user,
    })
    const listing = await this.listingsService.findOne(application.listing.id)
    if (application.applicant.emailAddress) {
      await this.emailService.confirmation(listing, application, applicationCreateDto.appUrl)
    }
    await this.applicationFlaggedSetsService.onApplicationSave(application)
    return application
  }

  private async authorizeUserAction<T extends Application | ApplicationCreateDto>(
    user,
    app: T,
    action
  ) {
    let resource: T = app

    if (app instanceof Application) {
      resource = {
        ...app,
        user_id: app.userId,
        listing_id: app.listingId,
      }
    } else if (app instanceof ApplicationCreateDto) {
      resource = {
        ...app,
        listing_id: app.listing.id,
      }
    }
    return this.authzService.canOrThrow(user, "application", action, resource)
  }
}

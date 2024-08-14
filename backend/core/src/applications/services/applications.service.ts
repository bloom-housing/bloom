import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, DeepPartial, QueryFailedError, Repository } from "typeorm"
import { paginate, Pagination, PaginationTypeEnum } from "nestjs-typeorm-paginate"
import { Request as ExpressRequest } from "express"
import { REQUEST } from "@nestjs/core"
import retry from "async-retry"
import crypto from "crypto"
import { AuthzService } from "../../auth/services/authz.service"
import { ListingsService } from "../../listings/listings.service"
import { Application } from "../entities/application.entity"
import { authzActions } from "../../auth/enum/authz-actions.enum"
import { assignDefined } from "../../shared/utils/assign-defined"
import { EmailService } from "../../email/email.service"
import { getView } from "../views/view"
import { PaginatedApplicationListQueryParams } from "../dto/paginated-application-list-query-params"
import { ApplicationCreateDto } from "../dto/application-create.dto"
import { ApplicationUpdateDto } from "../dto/application-update.dto"
import { ApplicationsCsvListQueryParams } from "../dto/applications-csv-list-query-params"
import { Listing } from "../../listings/entities/listing.entity"
import { ApplicationCsvExporterService } from "./application-csv-exporter.service"
import { User } from "../../auth/entities/user.entity"
import { StatusDto } from "../../shared/dto/status.dto"
import { GeocodingService } from "./geocoding.service"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationsService {
  constructor(
    @Inject(REQUEST) private req: ExpressRequest,
    private readonly authzService: AuthzService,
    private readonly listingsService: ListingsService,
    private readonly emailService: EmailService,
    private readonly applicationCsvExporter: ApplicationCsvExporterService,
    private readonly geocodingService: GeocodingService,
    @InjectRepository(Application) private readonly repository: Repository<Application>,
    @InjectRepository(Listing) private readonly listingsRepository: Repository<Listing>
  ) {}

  public async list(params: PaginatedApplicationListQueryParams) {
    const qb = this._getQb(params)
    const result = await qb.getMany()

    await Promise.all(
      result.map(async (application) => {
        await this.authorizeUserAction(
          this.req.user,
          application,
          application.listingId,
          authzActions.read
        )
      })
    )

    return result
  }

  public async rawListWithFlagged(params: ApplicationsCsvListQueryParams) {
    await this.authorizeCSVExport(this.req.user, params.listingId)

    const qb = this._getQb(params)
    qb.leftJoin(
      "application_flagged_set_applications_applications",
      "application_flagged_set_applications_applications",
      "application_flagged_set_applications_applications.applications_id = application.id"
    )
    qb.addSelect(
      "count(application_flagged_set_applications_applications.applications_id) > 0 as flagged"
    )
    qb.groupBy(
      "application.id, applicant.id, applicant_address.id, applicant_workAddress.id, alternateAddress.id, mailingAddress.id, alternateContact.id, alternateContact_mailingAddress.id, accessibility.id, demographics.id, householdMembers.id, householdMembers_address.id, householdMembers_workAddress.id, preferredUnit.id"
    )
    const applications = await qb.getRawMany()

    return applications
  }

  async listPaginated(
    params: PaginatedApplicationListQueryParams
  ): Promise<Pagination<Application>> {
    const qb = this._getQb(params, params.listingId ? "partnerList" : undefined)

    const applicationIDQB = this._getQb(params, params.listingId ? "partnerList" : undefined, false)
    applicationIDQB.select("application.id")
    applicationIDQB.groupBy("application.id")
    if (params.orderBy) {
      applicationIDQB.addSelect(params.orderBy)
      applicationIDQB.addGroupBy(params.orderBy)
    }
    const applicationIDResult = await paginate<Application>(applicationIDQB, {
      limit: params.limit,
      page: params.page,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    })

    if (applicationIDResult.items.length) {
      qb.andWhere("application.id IN (:...applicationIDs)", {
        applicationIDs: applicationIDResult.items.map((elem) => elem.id),
      })
    }

    const result = await qb.getMany()

    const promiseArray = result.map((application) =>
      this.getDuplicateFlagsForApplication(application.id)
    )
    const flags = await Promise.all(promiseArray)
    result.forEach((application, index) => {
      application.flagged = !!flags[index].id
    })

    await Promise.all(
      result.map(async (application) => {
        await this.authorizeUserAction(
          this.req.user,
          application,
          application.listingId,
          authzActions.read
        )
      })
    )

    return {
      ...applicationIDResult,
      items: result,
    }
  }

  async submit(applicationCreateDto: ApplicationCreateDto) {
    applicationCreateDto.submissionDate = new Date()

    const listing = await this.listingsService
      .createQueryBuilder("listings")
      .where(`listings.id = :listingId`, { listingId: applicationCreateDto.listing.id })
      .select(["listings.applicationDueDate", "listings.id"])
      .getOne()

    if (
      listing &&
      listing.applicationDueDate &&
      applicationCreateDto.submissionDate > listing.applicationDueDate
    ) {
      throw new BadRequestException("Listing is not open for application submission.")
    }

    await this.authorizeUserAction(
      this.req.user,
      applicationCreateDto,
      listing.id,
      authzActions.submit
    )

    return await this._create(
      {
        ...applicationCreateDto,
        user: this.req.user,
      },
      true
    )
  }

  async create(applicationCreateDto: ApplicationCreateDto) {
    await this.authorizeUserAction(
      this.req.user,
      applicationCreateDto,
      applicationCreateDto.listing.id,
      authzActions.create
    )

    return this._create(applicationCreateDto, false)
  }

  async findOne(applicationId: string) {
    const application = await this.repository.findOne({
      where: {
        id: applicationId,
      },
      relations: ["user"],
    })

    if (!application) {
      throw new NotFoundException()
    }

    await this.authorizeUserAction(
      this.req.user,
      application,
      application.listingId,
      authzActions.read
    )

    return application
  }

  async update(applicationUpdateDto: ApplicationUpdateDto) {
    const application = await this.repository.findOne({
      where: { id: applicationUpdateDto.id },
    })

    if (!application) {
      throw new NotFoundException()
    }

    await this.authorizeUserAction(
      this.req.user,
      application,
      application.listingId,
      authzActions.update
    )

    assignDefined(application, {
      ...applicationUpdateDto,
      id: application.id,
    })

    const app = await this.repository.manager.transaction(
      "SERIALIZABLE",
      async (transactionalEntityManager) => {
        const applicationsRepository = transactionalEntityManager.getRepository(Application)

        const newApplication = await applicationsRepository.save(application)

        await this.updateListingApplicationEditTimestamp(
          newApplication.listingId,
          transactionalEntityManager.getRepository(Listing)
        )

        return await applicationsRepository.findOne({ where: { id: newApplication.id } })
      }
    )

    const listing = await this.listingsService.findOne(application.listingId)

    // Calculate geocoding preferences after save
    if (listing.jurisdiction?.enableGeocodingPreferences) {
      try {
        void this.geocodingService.validateGeocodingPreferences(application, listing)
      } catch (e) {
        console.warn("error while validating geocoding preferences")
      }
    }
    return app
  }

  async delete(applicationId: string) {
    const application = await this.repository.findOne({ where: { id: applicationId } })

    if (!application) {
      throw new NotFoundException()
    }

    await this.authorizeUserAction(
      this.req.user,
      application,
      application.listingId,
      authzActions.delete
    )

    await this.updateListingApplicationEditTimestamp(application.listingId)

    return await this.repository.softRemove({ id: applicationId })
  }

  sendExport(queryParams: ApplicationsCsvListQueryParams): StatusDto {
    void this.sendExportHelper(queryParams)

    return {
      status: "Success",
    }
  }

  async sendExportHelper(queryParams: ApplicationsCsvListQueryParams): Promise<void> {
    const applications = await this.rawListWithFlagged(queryParams)
    const csvString = this.applicationCsvExporter.exportFromObject(
      applications,
      queryParams.timeZone,
      queryParams.includeDemographics
    )
    const listing = await this.listingsRepository.findOne({ where: { id: queryParams.listingId } })
    await this.emailService.sendCSV(
      this.req.user as unknown as User,
      listing.name,
      listing.id,
      csvString
    )
  }

  private _getQb(params: PaginatedApplicationListQueryParams, view = "base", withSelect = true) {
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
      orderBy: (qb, { orderBy, order }) => qb.orderBy(orderBy, order, "NULLS LAST"),
      search: (qb, { search }) => {
        qb.andWhere(
          new Brackets((subQb) => {
            subQb.where("application.confirmationCode ILIKE :search", { search: `%${search}%` })
            subQb.orWhere("applicant.firstName ILIKE :search", { search: `%${search}%` })
            subQb.orWhere("applicant.lastName ILIKE :search", { search: `%${search}%` })
            subQb.orWhere("applicant.emailAddress ILIKE :search", {
              search: `%${search}%`,
            })
            subQb.orWhere("applicant.phoneNumber ILIKE :search", { search: `%${search}%` })
            subQb.orWhere(
              "CONCAT(applicant.firstName, ' ', applicant.lastName, ' ', applicant.emailAddress, ' ', applicant.phoneNumber) ILIKE :search",
              { search: `%${search}%` }
            )
            subQb.orWhere("alternateContact.firstName ILIKE :search", { search: `%${search}%` })
            subQb.orWhere("alternateContact.lastName ILIKE :search", { search: `%${search}%` })
            subQb.orWhere("alternateContact.emailAddress ILIKE :search", {
              search: `%${search}%`,
            })
            subQb.orWhere("alternateContact.phoneNumber ILIKE :search", { search: `%${search}%` })
            subQb.orWhere(
              "CONCAT(alternateContact.firstName, ' ', alternateContact.lastName, ' ', alternateContact.emailAddress, ' ', alternateContact.phoneNumber) ILIKE :search",
              { search: `%${search}%` }
            )
          })
        )
      },
    }

    // --> Build main query
    const qbView = getView(this.repository.createQueryBuilder("application"), view)
    const qb = qbView.getViewQb(withSelect)
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

  private async _createApplication(applicationCreateDto: DeepPartial<Application>) {
    return await this.repository.manager.transaction(
      "SERIALIZABLE",
      async (transactionalEntityManager) => {
        const applicationsRepository = transactionalEntityManager.getRepository(Application)

        const application = await applicationsRepository.save({
          ...applicationCreateDto,
          confirmationCode: ApplicationsService.generateConfirmationCode(),
        })

        await this.updateListingApplicationEditTimestamp(
          application.listingId,
          transactionalEntityManager.getRepository(Listing)
        )

        return await applicationsRepository.findOne({ where: { id: application.id } })
      }
    )
  }

  private async _create(
    applicationCreateDto: DeepPartial<Application>,
    shouldSendConfirmation: boolean
  ) {
    let application: Application

    try {
      await retry(
        async (bail) => {
          try {
            application = await this._createApplication(applicationCreateDto)
          } catch (e) {
            console.error(
              `Application submission error on listing id ${applicationCreateDto.listingId} - ${e.message}`
            )
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (
              !(
                e instanceof QueryFailedError &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // NOTE: 40001 could not serialize access due to read/write dependencies among transactions
                (e.code === "40001" ||
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  // NOTE: constraint UQ_556c258a4439f1b7f53de2ed74f checks whether listing.id & confirmationCode is a unique combination
                  //  it does make sense here to retry because it's a randomly generated 8 character string value
                  (e.code === "23505" && e.constraint === "UQ_556c258a4439f1b7f53de2ed74f"))
              )
            ) {
              bail(e)
              return
            }
            throw e
          }
        },
        { retries: 6, minTimeout: 200 }
      )
    } catch (e) {
      console.log("Create application error = ", e)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e instanceof QueryFailedError && e.code === "40001") {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: "Too Many Requests",
            message: "Please try again later.",
          },
          429
        )
      }
      throw e
    }

    // Listing is not eagerly joined on application entity so let's use the one provided with
    // create dto
    const listing = await this.listingsService.findOne(applicationCreateDto.listing.id)
    if (application.applicant.emailAddress && shouldSendConfirmation) {
      await this.emailService.confirmation(listing, application, applicationCreateDto.appUrl)
    }

    // Calculate geocoding preferences after save and email sent
    if (listing.jurisdiction?.enableGeocodingPreferences) {
      try {
        void this.geocodingService.validateGeocodingPreferences(application, listing)
      } catch (e) {
        console.warn("error while validating geocoding preferences")
      }
    }
    return application
  }

  private async authorizeUserAction<T extends Application | ApplicationCreateDto>(
    user,
    app: T,
    listingId: string,
    action
  ) {
    const jurisdictionId = await this.listingsService.getJurisdictionIdByListingId(listingId)

    const resource: T & { listingId: string; jurisdictionId: string } = {
      ...app,
      listingId,
      jurisdictionId,
    }

    return this.authzService.canOrThrow(user, "application", action, resource)
  }

  private async authorizeCSVExport(user, listingId) {
    /**
     * Checking authorization for each application is very expensive.
     * By making listingId required, we can check if the user has update permissions for the listing, since right now if a user has that
     * they also can run the export for that listing
     */
    const jurisdictionId = await this.listingsService.getJurisdictionIdByListingId(listingId)

    return await this.authzService.canOrThrow(user, "listing", authzActions.update, {
      listingId,
      jurisdictionId,
    })
  }

  public static generateConfirmationCode(): string {
    return crypto.randomBytes(4).toString("hex").toUpperCase()
  }

  private async updateListingApplicationEditTimestamp(
    listingId: string,
    repository: Repository<Listing> = this.listingsRepository
  ) {
    const listing = await repository.findOne({ where: { id: listingId } })
    listing.lastApplicationUpdateAt = new Date()
    await repository.save(listing)
  }

  private getDuplicateFlagsForApplication(applicationId: string) {
    return this.repository
      .createQueryBuilder("applications")
      .select("applications.id", "appId")
      .addSelect("application_flagged_set_applications_applications.applications_id", "id")
      .addSelect("applications.review_status", "status")
      .leftJoin(
        "application_flagged_set_applications_applications",
        "application_flagged_set_applications_applications",
        "application_flagged_set_applications_applications.applications_id = applications.id"
      )
      .where("applications.id = :id", { id: applicationId })
      .getRawOne()
  }
}

import { Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { Brackets, In, Repository } from "typeorm"
import { Listing } from "./entities/listing.entity"
import { getView } from "./views/view"
import { summarizeUnits, summarizeUnitsByTypeAndRent } from "../shared/units-transformations"
import { Language, ListingReviewOrder } from "../../types"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingsQueryParams } from "./dto/listings-query-params"
import { ListingStatus } from "./types/listing-status-enum"
import { TranslationsService } from "../translations/services/translations.service"
import { authzActions } from "../auth/enum/authz-actions.enum"
import { AuthzService } from "../auth/services/authz.service"
import { Request as ExpressRequest } from "express"
import { REQUEST } from "@nestjs/core"
import { User } from "../auth/entities/user.entity"
import { ApplicationFlaggedSetsService } from "../application-flagged-sets/application-flagged-sets.service"
import { ListingsQueryBuilder } from "./db/listing-query-builder"
import { CachePurgeService } from "./cache-purge.service"
import { EmailService } from "../email/email.service"

@Injectable({ scope: Scope.REQUEST })
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    @InjectRepository(AmiChart) private readonly amiChartsRepository: Repository<AmiChart>,
    private readonly translationService: TranslationsService,
    private readonly authzService: AuthzService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(REQUEST) private req: ExpressRequest,
    private readonly afsService: ApplicationFlaggedSetsService,
    private readonly cachePurgeService: CachePurgeService,
    private readonly emailService: EmailService
  ) {}

  private getFullyJoinedQueryBuilder() {
    return getView(this.createQueryBuilder("listings"), "full").getViewQb()
  }

  public async list(params: ListingsQueryParams): Promise<Pagination<Listing>> {
    const innerFilteredQuery = this.createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      // Those left joines are required for addFilters to work (see
      // backend/core/src/listings/dto/filter-type-to-field-map.ts
      .leftJoin("listings.leasingAgents", "leasingAgents")
      .leftJoin("listings.buildingAddress", "buildingAddress")
      .leftJoin("listings.units", "units")
      .leftJoin("units.unitType", "unitTypeRef")
      .leftJoin("listings.jurisdiction", "jurisdiction")
      .addFilters(params.filter)
      .addOrderConditions(params.orderBy, params.orderDir)
      .addSearchByListingNameCondition(params.search)
      .paginate(params.limit, params.page)
      .groupBy("listings.id")

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const user = this.req?.user as User
    if (user?.roles?.isJurisdictionalAdmin) {
      innerFilteredQuery.andWhere("listings.jurisdiction_id IN (:...jurisdiction)", {
        jurisdiction: user.jurisdictions.map((elem) => elem.id),
      })
    }

    const view = getView(this.createQueryBuilder("listings"), params.view)

    const listingsPaginated = await view
      .getViewQb()
      .addInnerFilteredQuery(innerFilteredQuery)
      .addOrderConditions(params.orderBy, params.orderDir)
      .getManyPaginated()

    if (!params.view || params.view === "full") {
      const promiseArray = listingsPaginated.items.map((listing) =>
        this.getUnitsForListing(listing.id)
      )
      const units = await Promise.all(promiseArray)
      listingsPaginated.items.forEach((listing, index) => {
        listing.units = units[index].units
      })
    }

    return {
      ...listingsPaginated,
      items: listingsPaginated.items.map(
        (listing) =>
          ({
            ...listing,
            unitsSummarized: {
              byUnitTypeAndRent: summarizeUnitsByTypeAndRent(listing.units, listing),
            },
          } as Listing)
      ),
    }
  }

  async create(listingDto: ListingCreateDto) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await this.authzService.canOrThrow(this.req.user as User, "listing", authzActions.create, {
      jurisdictionId: listingDto.jurisdiction.id,
    })

    const listing = this.listingRepository.create({
      ...listingDto,
      publishedAt: listingDto.status === ListingStatus.active ? new Date() : null,
      closedAt: listingDto.status === ListingStatus.closed ? new Date() : null,
    })

    return await listing.save()
  }

  async update(listingDto: ListingUpdateDto) {
    const qb = this.getFullyJoinedQueryBuilder()
    const listing = await this.getListingAndUnits(qb, listingDto.id)

    if (!listing) {
      throw new NotFoundException()
    }

    await this.authorizeUserActionForListingId(this.req.user, listing.id, authzActions.update)

    const availableUnits =
      listingDto.reviewOrderType !== ListingReviewOrder.waitlist ? listingDto.units.length : 0
    listingDto.units.forEach((unit) => {
      if (!unit.id) {
        delete unit.id
      }
    })
    listingDto.unitsAvailable = availableUnits

    if (listing.status == ListingStatus.active && listingDto.status === ListingStatus.closed) {
      await this.afsService.scheduleAfsProcessing()
    }

    if (listingDto.buildingSelectionCriteria) {
      listing.buildingSelectionCriteriaFile = null
      await this.listingRepository.update(
        { id: listing.id },
        {
          buildingSelectionCriteriaFile: null,
        }
      )
    } else if (listingDto.buildingSelectionCriteriaFile) {
      listing.buildingSelectionCriteria = null
    }

    const previousStatus = listing.status
    const newStatus = listingDto.status
    Object.assign(listing, {
      ...listingDto,
      publishedAt:
        listing.status !== ListingStatus.active && listingDto.status === ListingStatus.active
          ? new Date()
          : listing.publishedAt,
      closedAt:
        listing.status !== ListingStatus.closed && listingDto.status === ListingStatus.closed
          ? new Date()
          : listing.closedAt,
    })

    const saveResponse = await this.listingRepository.save(listing)
    await this.cachePurgeService.cachePurgeForSingleListing(previousStatus, newStatus, saveResponse)
    return saveResponse
  }

  async delete(listingId: string) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingId },
    })

    await this.authorizeUserActionForListingId(this.req.user, listing.id, authzActions.delete)

    return await this.listingRepository.remove(listing)
  }

  async findOne(listingId: string, lang: Language = Language.en, view = "full") {
    const qb = getView(this.createQueryBuilder("listings"), view).getViewQb()
    const result = await this.getListingAndUnits(qb, listingId)

    if (!result) {
      throw new NotFoundException()
    }

    if (lang !== Language.en) {
      await this.translationService.translateListing(result, lang)
    }

    await this.addUnitsSummarized(result)
    return result
  }

  public createQueryBuilder(alias: string): ListingsQueryBuilder {
    return new ListingsQueryBuilder(this.listingRepository.createQueryBuilder(alias))
  }

  public async getJurisdictionIdByListingId(listingId: string | null): Promise<string | null> {
    if (!listingId) {
      return null
    }

    const listing = await this.createQueryBuilder("listings")
      .where(`listings.id = :listingId`, { listingId })
      .leftJoin("listings.jurisdiction", "jurisdiction")
      .select(["listings.id", "jurisdiction.id"])
      .getOne()

    return listing.jurisdiction.id
  }

  public async requestApproval(listingId: string, listingName: string) {
    await this.listingRepository.update(listingId, { status: ListingStatus.pendingReview })

    const adminUsers = await this.userRepository
      .createQueryBuilder("user")
      .select(["user.id", "user.email"])
      .leftJoin("user.roles", "userRoles")
      //verify this permissioning approach
      .where("userRoles.is_jurisdictional_admin = :is_jurisdictional_admin", {
        is_jurisdctional_admin: true,
      })
      .orWhere("userRoles.is_partner = :is_admin", { is_admin: true })
      .getMany()

    const adminEmails: string[] = []
    adminUsers?.forEach((users) => users?.email && adminEmails.push(users.email))
    await this.emailService.requestApproval(this.req.user, listingName, listingId, adminEmails)
  }

  async rawListWithFlagged() {
    const userAccess = await this.userRepository
      .createQueryBuilder("user")
      .select(["user.id", "jurisdictions.id"])
      .leftJoin("user.roles", "userRole")
      .leftJoin("user.jurisdictions", "jurisdictions")
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      .where("user.id = :id", { id: (this.req.user as User)?.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where("userRole.is_admin = :is_admin", {
            is_admin: true,
          }).orWhere("userRole.is_jurisdictional_admin = :is_jurisdictional_admin", {
            is_jurisdictional_admin: true,
          })
        })
      )
      .getOne()

    if (!userAccess) {
      throw new UnauthorizedException()
    }

    // generated out list of permissioned listings
    const permissionedListings = await this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id")
      .where("listings.jurisdiction_id IN (:...jurisdiction)", {
        jurisdiction: userAccess.jurisdictions.map((elem) => elem.id),
      })
      .getMany()

    // pulled out on the ids
    const listingIds = permissionedListings.map((listing) => listing.id)

    // Building and excecuting query for listings csv
    const listingsQb = getView(this.createQueryBuilder("listings"), "listingsExport").getViewQb()

    const listingData = await listingsQb
      .where("listings.id IN (:...listingIds)", { listingIds })
      .getMany()

    // User data to determine listing access for csv
    const userAccessData = await this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.firstName",
        "user.lastName",
        "userRoles.isAdmin",
        "userRoles.isPartner",
        "leasingAgentInListings.id",
      ])
      .leftJoin("user.leasingAgentInListings", "leasingAgentInListings")
      .leftJoin("user.jurisdictions", "jurisdictions")
      .leftJoin("user.roles", "userRoles")
      .where("userRoles.is_partner = :is_partner", { is_partner: true })
      .getMany()

    // Building and excecuting query for units csv
    const unitsQb = getView(this.createQueryBuilder("listings"), "unitsExport").getViewQb()

    const unitData = await unitsQb
      .where("listings.id IN (:...listingIds)", { listingIds })
      .getMany()

    listingData.forEach((listing) => {
      const unitQuantity = unitData.find((unit) => unit.id === listing.id)?.units?.length
      listing["numberOfUnits"] = unitQuantity
    })

    return {
      unitData,
      listingData,
      userAccessData,
    }
  }

  private async addUnitsSummarized(listing: Listing) {
    if (Array.isArray(listing.units) && listing.units.length > 0) {
      const amiCharts = await this.amiChartsRepository.find({
        where: { id: In(listing.units.map((unit) => unit.amiChartId)) },
      })
      listing.unitsSummarized = summarizeUnits(listing.units, amiCharts, listing)
    }
    return listing
  }

  private async authorizeUserActionForListingId(user, listingId: string, action) {
    /**
     * Checking authorization for each application is very expensive. By making lisitngId required, we can check if the user has update permissions for the listing, since right now if a user has that they also can run the export for that listing
     */
    const jurisdictionId = await this.getJurisdictionIdByListingId(listingId)

    return await this.authzService.canOrThrow(user, "listing", action, {
      id: listingId,
      jurisdictionId,
    })
  }

  private getUnitsForListing(listingId: string) {
    return this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id")
      .leftJoinAndSelect("listings.units", "units")
      .leftJoinAndSelect("units.amiChartOverride", "amiChartOverride")
      .leftJoinAndSelect("units.unitType", "unitTypeRef")
      .leftJoinAndSelect("units.unitRentType", "unitRentType")
      .leftJoinAndSelect("units.priorityType", "priorityType")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .where("listings.id = :id", { id: listingId })
      .getOne()
  }

  private async getListingAndUnits(listingQuery: ListingsQueryBuilder, listingId: string) {
    const fullListingDataQuery = listingQuery.where("listings.id = :id", { id: listingId }).getOne()

    const fullUnitDataQuery = this.getUnitsForListing(listingId)

    const [result, unitData] = await Promise.all([fullListingDataQuery, fullUnitDataQuery])
    result.units = unitData.units

    return result
  }
}

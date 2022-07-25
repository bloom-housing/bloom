import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { In, Repository } from "typeorm"
import { Interval } from "@nestjs/schedule"
import { Listing } from "./entities/listing.entity"
import { getView } from "./views/view"
import { summarizeUnits, summarizeUnitsByTypeAndRent } from "../shared/units-transformations"
import { Language, ListingAvailability } from "../../types"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingsQueryParams } from "./dto/listings-query-params"
import { ListingStatus } from "./types/listing-status-enum"
import { TranslationsService } from "../translations/services/translations.service"
import { authzActions } from "../auth/enum/authz-actions.enum"
import { ListingRepository } from "./db/listing.repository"
import { AuthzService } from "../auth/services/authz.service"
import { Request as ExpressRequest } from "express"
import { REQUEST } from "@nestjs/core"
import { User } from "../auth/entities/user.entity"

@Injectable({ scope: Scope.REQUEST })
export class ListingsService {
  constructor(
    @InjectRepository(ListingRepository) private readonly listingRepository: ListingRepository,
    @InjectRepository(AmiChart) private readonly amiChartsRepository: Repository<AmiChart>,
    private readonly translationService: TranslationsService,
    private readonly authzService: AuthzService,
    @Inject(REQUEST) private req: ExpressRequest
  ) {}

  private getFullyJoinedQueryBuilder() {
    return getView(this.listingRepository.createQueryBuilder("listings"), "full").getViewQb()
  }

  public async list(params: ListingsQueryParams): Promise<Pagination<Listing>> {
    const innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
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

    const view = getView(this.listingRepository.createQueryBuilder("listings"), params.view)

    const listingsPaginated = await view
      .getViewQb()
      .addInnerFilteredQuery(innerFilteredQuery)
      .addOrderConditions(params.orderBy, params.orderDir)
      .addOrderBy("units.max_occupancy", "ASC", "NULLS LAST")
      .getManyPaginated()

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
    qb.where("listings.id = :id", { id: listingDto.id })
    const listing = await qb.getOne()

    if (!listing) {
      throw new NotFoundException()
    }

    await this.authorizeUserActionForListingId(this.req.user, listing.id, authzActions.update)

    const availableUnits =
      listingDto.listingAvailability === ListingAvailability.availableUnits
        ? listingDto.units.length
        : 0
    listingDto.units.forEach((unit) => {
      if (!unit.id) {
        delete unit.id
      }
    })
    listingDto.unitsAvailable = availableUnits

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

    return await this.listingRepository.save(listing)
  }

  async delete(listingId: string) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingId },
    })

    await this.authorizeUserActionForListingId(this.req.user, listing.id, authzActions.delete)

    return await this.listingRepository.remove(listing)
  }

  async findOne(listingId: string, lang: Language = Language.en, view = "full") {
    const qb = getView(this.listingRepository.createQueryBuilder("listings"), view).getViewQb()
    const result = await qb
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "listingPreferences.ordinal": "ASC",
      })
      .getOne()

    if (!result) {
      throw new NotFoundException()
    }

    if (lang !== Language.en) {
      await this.translationService.translateListing(result, lang)
    }

    await this.addUnitsSummarized(result)
    return result
  }

  @Interval(1000 * 60 * 60)
  public async changeOverdueListingsStatusCron() {
    const listings = await this.listingRepository
      .createQueryBuilder("listings")
      .select(["listings.id", "listings.applicationDueDate", "listings.status"])
      .where(`listings.status = '${ListingStatus.active}'`)
      .andWhere(`listings.applicationDueDate IS NOT NULL`)
      .andWhere(`listings.applicationDueDate < NOW()`)
      .getMany()

    for (const listing of listings) {
      listing.status = ListingStatus.closed
      listing.closedAt = new Date()
    }

    await this.listingRepository.save(listings)
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
    const jurisdictionId = await this.listingRepository.getJurisdictionIdByListingId(listingId)

    return await this.authzService.canOrThrow(user, "listing", action, {
      id: listingId,
      jurisdictionId,
    })
  }
}

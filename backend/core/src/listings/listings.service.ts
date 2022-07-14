import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { In, Repository } from "typeorm"
import { Interval } from "@nestjs/schedule"
import { Listing } from "./entities/listing.entity"
import { addFilters } from "../shared/query-filter"
import { getView } from "./views/view"
import { summarizeUnits } from "../shared/units-transformations"
import { Language, ListingAvailability } from "../../types"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { OrderByFieldsEnum } from "./types/listing-orderby-enum"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingFilterParams } from "./dto/listing-filter-params"
import { ListingsQueryParams } from "./dto/listings-query-params"
import { filterTypeToFieldMap } from "./dto/filter-type-to-field-map"
import { ListingStatus } from "./types/listing-status-enum"
import { TranslationsService } from "../translations/services/translations.service"
import { OrderParam } from "../applications/types/order-param"
import { authzActions } from "../auth/enum/authz-actions.enum"
import { ListingRepository } from "./repositories/listing.repository"
import { AuthzService } from "../auth/services/authz.service"
import { Request as ExpressRequest } from "express"
import { REQUEST } from "@nestjs/core"
import { User } from "../auth/entities/user.entity"

type OrderByConditionData = {
  orderBy: string
  orderDir: "DESC" | "ASC"
  nulls?: "NULLS LAST" | "NULLS FIRST"
}

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
    // Inner query to get the sorted listing ids of the listings to display
    // TODO(avaleske): Only join the tables we need for the filters that are applied
    const innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      .leftJoin("listings.leasingAgents", "leasingAgents")
      .leftJoin("listings.buildingAddress", "buildingAddress")
      .leftJoin("listings.units", "units")
      .leftJoin("units.unitType", "unitTypeRef")

    const orderByConditions = ListingsService.buildOrderByConditions(params)
    for (const orderByCondition of orderByConditions) {
      innerFilteredQuery.addOrderBy(
        orderByCondition.orderBy,
        orderByCondition.orderDir,
        orderByCondition.nulls
      )
    }

    innerFilteredQuery.groupBy("listings.id")

    if (params.filter) {
      addFilters<Array<ListingFilterParams>, typeof filterTypeToFieldMap>(
        params.filter,
        filterTypeToFieldMap,
        innerFilteredQuery
      )
    }

    if (params.search) {
      innerFilteredQuery.andWhere("listings.name ILIKE :search", { search: `%${params.search}%` })
    }

    const user = this.req.user as User
    if (user?.roles?.isJurisdictionalAdmin) {
      innerFilteredQuery.andWhere("listings.jurisdiction_id IN (:...jurisdiction)", {
        jurisdiction: user.jurisdictions.map((elem) => elem.id),
      })
    }

    // TODO(avaleske): Typescript doesn't realize that the `paginate` bool is a
    // type guard, but it will in version 4.4. Once this codebase is upgraded to
    // v4.4, remove the extra type assertions on `params.limit` below.
    const paginate = params.limit !== "all" && params.limit > 0 && params.page > 0
    if (paginate) {
      // Calculate the number of listings to skip (because they belong to lower page numbers).
      const offset = (params.page - 1) * (params.limit as number)
      // Add the limit and offset to the inner query, so we only do the full
      // join on the listings we want to show.
      innerFilteredQuery.offset(offset).limit(params.limit as number)
    }
    const view = getView(this.listingRepository.createQueryBuilder("listings"), params.view)

    const mainQuery = view.getViewQb()

    for (const query of [mainQuery, innerFilteredQuery]) {
      for (const orderByCondition of orderByConditions) {
        query.addOrderBy(
          orderByCondition.orderBy,
          orderByCondition.orderDir,
          orderByCondition.nulls
        )
      }
    }

    mainQuery
      .andWhere("listings.id IN (" + innerFilteredQuery.getQuery() + ")")
      // Set the inner WHERE params on the outer query, as noted in the TypeORM docs.
      // (WHERE params are the values passed to andWhere() that TypeORM escapes
      // and substitues for the `:paramName` placeholders in the WHERE clause.)
      .setParameters(innerFilteredQuery.getParameters())

    // Order by units.maxOccupancy is applied last so that it affects the order
    // of units _within_ a listing, rather than the overall listing order)
    let listings = await mainQuery.addOrderBy("units.max_occupancy", "ASC", "NULLS LAST").getMany()

    // get summarized units from view
    listings = view.mapUnitSummary(listings)
    // Set pagination info
    const itemsPerPage = paginate ? (params.limit as number) : listings.length
    const totalItems = paginate ? await innerFilteredQuery.getCount() : listings.length
    const paginationInfo = {
      currentPage: paginate ? params.page : 1,
      itemCount: listings.length,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage), // will be 1 if no pagination
    }

    // There is a bug in nestjs-typeorm-paginate's handling of complex, nested
    // queries (https://github.com/nestjsx/nestjs-typeorm-paginate/issues/6) so
    // we build the pagination metadata manually. Additional details are in
    // https://github.com/CityOfDetroit/bloom/issues/56#issuecomment-865202733
    const paginatedListings: Pagination<Listing> = {
      items: listings,
      meta: paginationInfo,
      // nestjs-typeorm-paginate leaves these empty if no route is defined
      // This matches what other paginated endpoints, such as the applications
      // service, currently return.
      links: {
        first: "",
        previous: "",
        next: "",
        last: "",
      },
    }
    return paginatedListings
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

  private static getOrderByCondition(
    orderBy: OrderByFieldsEnum,
    orderDir: OrderParam
  ): OrderByConditionData {
    switch (orderBy) {
      case OrderByFieldsEnum.mostRecentlyUpdated:
        return { orderBy: "listings.updated_at", orderDir }
      case OrderByFieldsEnum.status:
        return { orderBy: "listings.status", orderDir }
      case OrderByFieldsEnum.name:
        return { orderBy: "listings.name", orderDir }
      case OrderByFieldsEnum.waitlistOpen:
        return { orderBy: "listings.isWaitlistOpen", orderDir }
      case OrderByFieldsEnum.unitsAvailable:
        return { orderBy: "property.unitsAvailable", orderDir }
      case OrderByFieldsEnum.mostRecentlyClosed:
        return {
          orderBy: "listings.closedAt",
          orderDir,
          nulls: "NULLS LAST",
        }
      case OrderByFieldsEnum.marketingType:
        return { orderBy: "listings.marketingType", orderDir }
      case OrderByFieldsEnum.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return { orderBy: "listings.applicationDueDate", orderDir }
      default:
        throw new HttpException(
          `OrderBy parameter not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
  }

  private static buildOrderByConditions(params: ListingsQueryParams): Array<OrderByConditionData> {
    if (!params.orderDir || !params.orderBy) {
      return [
        ListingsService.getOrderByCondition(OrderByFieldsEnum.applicationDates, OrderParam.ASC),
      ]
    }

    const orderByConditionDataArray = []
    for (let i = 0; i < params.orderDir.length; i++) {
      orderByConditionDataArray.push(
        ListingsService.getOrderByCondition(params.orderBy[i], params.orderDir[i])
      )
    }

    return orderByConditionDataArray
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

import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { In, Repository } from "typeorm"
import { plainToClass } from "class-transformer"
import { Interval } from "@nestjs/schedule"
import { Listing } from "./entities/listing.entity"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { addFilters } from "../shared/query-filter"
import { getView } from "./views/view"
import { summarizeUnits } from "../shared/units-transformations"
import { Language } from "../../types"
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

type OrderByConditionData = {key: string, order: "DESC" | "ASC", nulls?: "NULLS LAST" | "NULLS FIRST"}

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    @InjectRepository(AmiChart) private readonly amiChartsRepository: Repository<AmiChart>,
    private readonly translationService: TranslationsService
  ) {}

  private getFullyJoinedQueryBuilder() {
    return getView(this.listingRepository.createQueryBuilder("listings"), "full").getViewQb()
  }

  private static getOrderByCondition(orderBy: OrderByFieldsEnum, order: OrderParam): OrderByConditionData {
    switch (orderBy) {
      case OrderByFieldsEnum.mostRecentlyUpdated:
        return {key: "listings.updated_at", order}
      case OrderByFieldsEnum.status:
        return { key: "listings.status", order }
      case OrderByFieldsEnum.name:
        return { key: "listings.name", order }
      case OrderByFieldsEnum.waitlistOpen:
        return { key: "listings.isWaitlistOpen", order }
      case OrderByFieldsEnum.unitsAvailable:
        return { key: "property.unitsAvailable", order }
      case OrderByFieldsEnum.mostRecentlyClosed:
        return {
          key: "listings.closedAt", order, nulls: "NULLS LAST"
        }
      case OrderByFieldsEnum.marketingType:
        return { key: "listings.marketingType", order }
      case OrderByFieldsEnum.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return { key: "listings.applicationDueDate", order }
      default:
        throw new HttpException(
          `OrderBy parameter not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
  }

  private static buildOrderByConditions(params: ListingsQueryParams): Array<OrderByConditionData> {
    if (!params.order || !params.orderBy) {
      return [ListingsService.getOrderByCondition(OrderByFieldsEnum.applicationDates, OrderParam.ASC)]
    }
    const orderByConditionDataArray = []
    for(let i = 0; i < params.order.length; i++) {
      orderByConditionDataArray.push(ListingsService.getOrderByCondition(params.orderBy[i], params.order[i]))
    }
    return orderByConditionDataArray
  }

  public async list(params: ListingsQueryParams): Promise<Pagination<Listing>> {
    // Inner query to get the sorted listing ids of the listings to display
    // TODO(avaleske): Only join the tables we need for the filters that are applied
    let innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      .leftJoin("listings.property", "property")
      .leftJoin("listings.leasingAgents", "leasingAgents")
      .leftJoin("property.buildingAddress", "buildingAddress")
      .leftJoin("property.units", "units")
      .leftJoin("units.unitType", "unitTypeRef")

    const orderByConditions = ListingsService.buildOrderByConditions(params)
    for(const orderByCondition of orderByConditions) {
      innerFilteredQuery = innerFilteredQuery.addOrderBy(orderByCondition.key, orderByCondition.order, orderByCondition.nulls)
    }

      innerFilteredQuery = innerFilteredQuery
      .groupBy("listings.id")
      .addGroupBy("property.id")

    if (params.filter) {
      addFilters<Array<ListingFilterParams>, typeof filterTypeToFieldMap>(
        params.filter,
        filterTypeToFieldMap,
        innerFilteredQuery
      )
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

    let mainQuery = await view
      .getViewQb()
      .andWhere("listings.id IN (" + innerFilteredQuery.getQuery() + ")")
      // Set the inner WHERE params on the outer query, as noted in the TypeORM docs.
      // (WHERE params are the values passed to andWhere() that TypeORM escapes
      // and substitues for the `:paramName` placeholders in the WHERE clause.)
      .setParameters(innerFilteredQuery.getParameters())

    for(const orderByCondition of orderByConditions) {
      mainQuery = mainQuery.addOrderBy(orderByCondition.key, orderByCondition.order, orderByCondition.nulls)
    }

    // Order by units.maxOccupancy is applied last so that it affects the order
    // of units _within_ a listing, rather than the overall listing order)
    let listings = await mainQuery
      .addOrderBy("units.max_occupancy", "ASC", "NULLS LAST")
      .getMany()

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
    const listing = this.listingRepository.create({
      ...listingDto,
      publishedAt: listingDto.status === ListingStatus.active ? new Date() : null,
      closedAt: listingDto.status === ListingStatus.closed ? new Date() : null,
      property: plainToClass(PropertyCreateDto, listingDto),
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
    let availableUnits = 0
    listingDto.units.forEach((unit) => {
      if (!unit.id) {
        delete unit.id
      }
      if (unit.status === "available") {
        availableUnits++
      }
    })

    listingDto.unitsAvailable = availableUnits
    Object.assign(listing, {
      ...plainToClass(Listing, listingDto, { excludeExtraneousValues: true }),
      publishedAt:
        listing.status !== ListingStatus.active && listingDto.status === ListingStatus.active
          ? new Date()
          : listing.publishedAt,
      closedAt:
        listing.status !== ListingStatus.closed && listingDto.status === ListingStatus.closed
          ? new Date()
          : listing.closedAt,
      property: plainToClass(
        PropertyUpdateDto,
        {
          // NOTE: Create a property out of fields encapsulated in listingDto
          ...listingDto,
          // NOTE: Since we use the entire listingDto to create a property object the listing ID
          //  would overwrite propertyId fetched from DB
          id: listing.property.id,
        },
        { excludeExtraneousValues: true }
      ),
    })

    return await this.listingRepository.save(listing)
  }

  async delete(listingId: string) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingId },
    })
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

  private async addUnitsSummarized(listing: Listing) {
    if (Array.isArray(listing.property.units) && listing.property.units.length > 0) {
      const amiCharts = await this.amiChartsRepository.find({
        where: { id: In(listing.property.units.map((unit) => unit.amiChartId)) },
      })
      listing.unitsSummarized = summarizeUnits(listing.property.units, amiCharts)
    }
    return listing
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
}

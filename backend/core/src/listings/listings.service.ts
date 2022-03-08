import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { In, OrderByCondition, Repository } from "typeorm"
import { plainToClass } from "class-transformer"
import { Interval } from "@nestjs/schedule"
import { Queue } from "bull"
import { InjectQueue } from "@nestjs/bull"
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
import { ListingNotificationInfo, ListingUpdateType } from "./listings-notifications"
import { ListingStatus } from "./types/listing-status-enum"
import { TranslationsService } from "../translations/services/translations.service"

@Injectable({ scope: Scope.REQUEST })
export class ListingsService {
  constructor(
    @Inject(REQUEST) private req: ExpressRequest,
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    @InjectRepository(AmiChart) private readonly amiChartsRepository: Repository<AmiChart>,
    private readonly translationService: TranslationsService,
    @InjectQueue("listings-notifications")
    private listingsNotificationsQueue: Queue<ListingNotificationInfo>
  ) {}

  private getFullyJoinedQueryBuilder() {
    return getView(this.listingRepository.createQueryBuilder("listings"), "full").getViewQb()
  }

  public async list(params: ListingsQueryParams): Promise<Pagination<Listing>> {
    const getOrderByCondition = (params: ListingsQueryParams): OrderByCondition => {
      if (!params.orderBy) {
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return {
          "listings.applicationDueDate": "ASC",
          "listings.applicationOpenDate": "DESC",
        }
      }
      switch (params.orderBy) {
        case OrderByFieldsEnum.mostRecentlyUpdated:
          return { "listings.updated_at": "DESC" }
        case OrderByFieldsEnum.applicationDates:
        case undefined:
          // Default to ordering by applicationDates (i.e. applicationDueDate
          // and applicationOpenDate) if no orderBy param is specified.
          return {
            "listings.applicationDueDate": "ASC",
            "listings.applicationOpenDate": "DESC",
          }
        default:
          throw new HttpException(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `OrderBy parameter (${params.orderBy}) not recognized or not yet implemented.`,
            HttpStatus.NOT_IMPLEMENTED
          )
      }
    }

    // Inner query to get the sorted listing ids of the listings to display
    // TODO(avaleske): Only join the tables we need for the filters that are applied.
    const innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      .leftJoin("listings.property", "property")
      .leftJoin("listings.leasingAgents", "leasingAgents")
      .leftJoin("property.buildingAddress", "buildingAddress")
      .leftJoin("listings.unitsSummary", "unitsSummary")
      .leftJoin("unitsSummary.unitType", "summaryUnitType")
      .leftJoin("listings.reservedCommunityType", "reservedCommunityType")
      .leftJoin("listings.features", "listing_features")
      .groupBy("listings.id")
      .orderBy(getOrderByCondition(params))

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

    const listings = await view
      .getViewQb()
      .andWhere("listings.id IN (" + innerFilteredQuery.getQuery() + ")")
      // Set the inner WHERE params on the outer query, as noted in the TypeORM docs.
      // (WHERE params are the values passed to andWhere() that TypeORM escapes
      // and substitues for the `:paramName` placeholders in the WHERE clause.)
      .setParameters(innerFilteredQuery.getParameters())
      .orderBy(getOrderByCondition(params))
      // Order by unitSummary.unitType.numBedrooms and units.maxOccupancy so that, for a
      // given listing, its unitSummaries or units are sorted from lowest to highest
      // bedroom count.
      .addOrderBy("summaryUnitType.num_bedrooms", "ASC", "NULLS LAST")
      .getMany()

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

  async create(listingDto: ListingCreateDto): Promise<Listing> {
    const listing = this.listingRepository.create({
      ...listingDto,
      property: plainToClass(PropertyCreateDto, listingDto),
    })
    const saveResult: Listing = await listing.save()

    // Add a job to the listings notification queue, to asynchronously send notifications about
    // the creation of this new listing.
    await this.listingsNotificationsQueue.add({
      listing: saveResult,
      updateType: ListingUpdateType.CREATE,
    })

    return saveResult
  }

  async update(listingDto: ListingUpdateDto) {
    const qb = this.getFullyJoinedQueryBuilder()
    qb.where("listings.id = :id", { id: listingDto.id })
    const listing = await qb.getOne()
    const previousListingStatus: ListingStatus = listing.status

    if (!listing) {
      throw new NotFoundException()
    }

    this.userCanUpdateOrThrow(this.req.user, listingDto, previousListingStatus)

    let availableUnits = 0
    listingDto.units.forEach((unit) => {
      if (!unit.id) {
        delete unit.id
      }
      if (unit.status === "available") {
        availableUnits++
      }
    })
    listingDto.unitsSummary.forEach((summary) => {
      if (!summary.id) {
        delete summary.id
      }
    })
    listingDto.unitsAvailable = availableUnits
    Object.assign(listing, {
      ...plainToClass(Listing, listingDto, { excludeExtraneousValues: true }),
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

    const saveResult: Listing = await this.listingRepository.save(listing)
    const newListingStatus: ListingStatus = saveResult.status
    if (newListingStatus !== previousListingStatus && newListingStatus === ListingStatus.active) {
      await this.listingsNotificationsQueue.add({
        listing: saveResult,
        updateType: ListingUpdateType.MODIFY,
      })
    }
    return saveResult
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

  /**
   *
   * @param user
   * @param listing
   * @param action
   *
   * authz gaurd should already be used at this point,
   * so we know the user has general permissions to do this action.
   * We also have to check what the previous status was.
   * A partner can save a listing as any status as long as the previous status was active. Otherwise they can only save as pending
   */
  private userCanUpdateOrThrow(
    user,
    listing: ListingUpdateDto,
    previousListingStatus: ListingStatus
  ): boolean {
    const { isAdmin } = user.roles
    let canUpdate = false

    if (isAdmin) {
      canUpdate = true
    } else if (previousListingStatus !== ListingStatus.pending) {
      canUpdate = true
    } else if (listing.status === ListingStatus.pending) {
      canUpdate = true
    }

    if (!canUpdate) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
    }

    return canUpdate
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
    }

    await this.listingRepository.save(listings)
  }
}

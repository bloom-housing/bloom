import { HttpService } from "@nestjs/axios"
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { In, Repository } from "typeorm"
import qs from "qs"
import { firstValueFrom, catchError, of } from "rxjs"

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
import { ListingRepository } from "./db/listing.repository"
import { AuthzService } from "../auth/services/authz.service"
import { Request as ExpressRequest } from "express"
import { REQUEST } from "@nestjs/core"
import { User } from "../auth/entities/user.entity"
import { ApplicationFlaggedSetsService } from "../application-flagged-sets/application-flagged-sets.service"
import { ListingsQueryBuilder } from "./db/listing-query-builder"
import { ListingsRetrieveQueryParams } from "./dto/listings-retrieve-query-params"
import { AxiosResponse } from "axios"
import { Compare } from "../shared/dto/filter.dto"

type JurisdictionIdToExternalResponse = { [Identifier: string]: Pagination<Listing> }
export type ListingIncludeExternalResponse = {
  local: Pagination<Listing>
  external?: JurisdictionIdToExternalResponse
}

@Injectable({ scope: Scope.REQUEST })
export class ListingsService {
  constructor(
    @InjectRepository(ListingRepository) private readonly listingRepository: ListingRepository,
    @InjectRepository(AmiChart) private readonly amiChartsRepository: Repository<AmiChart>,
    private readonly translationService: TranslationsService,
    private readonly authzService: AuthzService,
    @Inject(REQUEST) private req: ExpressRequest,
    private readonly afsService: ApplicationFlaggedSetsService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const user = this.req?.user as User
    if (user?.roles?.isJurisdictionalAdmin) {
      innerFilteredQuery.andWhere("listings.jurisdiction_id IN (:...jurisdiction)", {
        jurisdiction: user.jurisdictions.map((elem) => elem.id),
      })
    }

    const view = getView(this.listingRepository.createQueryBuilder("listings"), params.view)

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

  public async listIncludeExternal(
    bloomJurisdictions: string[],
    params: ListingsQueryParams
  ): Promise<ListingIncludeExternalResponse> {
    return {
      local: await this.list(params),
      external: await this.listExternal(bloomJurisdictions, params),
    }
  }

  private async listExternal(
    bloomJurisdictions: string[],
    params: ListingsQueryParams
  ): Promise<JurisdictionIdToExternalResponse> {
    if (bloomJurisdictions == null || bloomJurisdictions.length == 0) {
      return {}
    }
    const bloomParamsNoJurisdiction = this.copyParamsForBloom(params)
    // begin build all http requests
    const httpRequests: Promise<AxiosResponse>[] = []
    for (const jurisdiction of bloomJurisdictions) {
      const newFilter = [
        ...(bloomParamsNoJurisdiction.filter || []),
        {
          jurisdiction: jurisdiction,
          $comparison: Compare["="],
        },
      ]
      httpRequests.push(
        firstValueFrom(
          this.httpService
            .get(
              this.configService.get<string>("BLOOM_API_BASE") +
                this.configService.get<string>("BLOOM_LISTINGS_QUERY"),
              {
                params: {
                  ...bloomParamsNoJurisdiction,
                  filter: newFilter,
                },
                paramsSerializer: (params) => {
                  return qs.stringify(params)
                },
              }
            )
            .pipe(
              catchError((error) => {
                if (error.response) {
                  console.error(`Error from Bloom with jurisdiction ${jurisdiction}`)
                  return of(error)
                } else {
                  // If there is no response, there was most likely a problem on our end.
                  throw new InternalServerErrorException()
                }
              })
            )
        )
      )
    }
    httpRequests.reverse()
    const results = await Promise.all(httpRequests)

    const response: JurisdictionIdToExternalResponse = {}
    results.forEach((result, index) => {
      if (result.status == 200) {
        response[bloomJurisdictions[index]] = result.data
      }
    })

    return response
  }

  private copyParamsForBloom(params: ListingsQueryParams): ListingsQueryParams {
    if (!params.filter) {
      return params
    }
    const paramCopy = {
      ...params,
    }
    // Note on .filter.filter: Confusingly bloomFriendlyListingsQueryParams is
    // an object with a key of "filter" which contains an array. Then the
    // array.prototype."filter" method is used which has an unfortunate name
    // collision.
    paramCopy.filter = paramCopy.filter.filter((param) => !param.jurisdiction)
    return paramCopy
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

  async findOneFromBloom(
    listingId: string,
    lang: Language = Language.en,
    queryParams: ListingsRetrieveQueryParams
  ) {
    const response = await firstValueFrom(
      this.httpService
        .get(
          this.configService.get<string>("BLOOM_API_BASE") +
            this.configService.get<string>("BLOOM_LISTINGS_QUERY") +
            "/" +
            listingId,
          {
            headers: { language: lang },
            params: queryParams,
            paramsSerializer: (params) => {
              return qs.stringify(params)
            },
          }
        )
        .pipe(
          catchError((error) => {
            if (error.response) {
              throw new NotFoundException("Bloom did not return a result")
            } else {
              // If there is no response, there was most likely a problem on our end.
              throw new InternalServerErrorException()
            }
          })
        )
    )
    return response.data
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

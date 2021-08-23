import { Injectable, NotFoundException } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import {
  ListingCreateDto,
  ListingUpdateDto,
  ListingFilterParams,
  filterTypeToFieldMap,
  ListingsQueryParams,
} from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { Repository } from "typeorm"
import { plainToClass } from "class-transformer"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { addFilters } from "../shared/filter"
import { Language } from "../../types"
import { TranslationsService } from "../translations/translations.service"
import { transitionState, ListingContext } from "./listing.states"
import { ListingStatus } from "./types/listing-status-enum"

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    private readonly translationService: TranslationsService
  ) {}

  private getFullyJoinedQueryBuilder() {
    return this.listingRepository
      .createQueryBuilder("listings")
      .leftJoinAndSelect("listings.applicationMethods", "applicationMethods")
      .leftJoinAndSelect("applicationMethods.paperApplications", "paperApplications")
      .leftJoinAndSelect("paperApplications.file", "paperApplicationFile")
      .leftJoinAndSelect("listings.image", "image")
      .leftJoinAndSelect("listings.events", "listingEvents")
      .leftJoinAndSelect("listingEvents.file", "listingEventFile")
      .leftJoinAndSelect("listings.result", "result")
      .leftJoinAndSelect("listings.applicationAddress", "applicationAddress")
      .leftJoinAndSelect("listings.leasingAgentAddress", "leasingAgentAddress")
      .leftJoinAndSelect("listings.applicationPickUpAddress", "applicationPickUpAddress")
      .leftJoinAndSelect("listings.applicationMailingAddress", "applicationMailingAddress")
      .leftJoinAndSelect("listings.applicationDropOffAddress", "applicationDropOffAddress")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.unitType", "unitTypeRef")
      .leftJoinAndSelect("units.unitRentType", "unitRentType")
      .leftJoinAndSelect("units.priorityType", "priorityType")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .leftJoinAndSelect("listings.jurisdiction", "jurisdiction")
      .leftJoinAndSelect("listings.reservedCommunityType", "reservedCommunityType")
  }

  public async list(params: ListingsQueryParams): Promise<Pagination<Listing>> {
    // Inner query to get the sorted listing ids of the listings to display
    // TODO(avaleske): Only join the tables we need for the filters that are applied
    const innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      .leftJoin("listings.property", "property")
      .leftJoin("property.units", "units")
      .leftJoin("units.unitType", "unitTypeRef")
      .groupBy("listings.id")
      .orderBy({ "listings.id": "DESC" })

    if (params.filter) {
      addFilters<ListingFilterParams, typeof filterTypeToFieldMap>(
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

    let listings = await this.getFullyJoinedQueryBuilder()
      .orderBy({
        "listings.id": "DESC",
        "units.max_occupancy": "ASC",
        "preferences.ordinal": "ASC",
      })
      .andWhere("listings.id IN (" + innerFilteredQuery.getQuery() + ")")
      // Set the inner WHERE params on the outer query, as noted in the TypeORM docs.
      // (WHERE params are the values passed to andWhere() that TypeORM escapes
      // and substitues for the `:paramName` placeholders in the WHERE clause.)
      .setParameters(innerFilteredQuery.getParameters())
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

    // TODO(https://github.com/CityOfDetroit/bloom/issues/135): Decide whether to remove jsonpath
    if (params.jsonpath) {
      listings = jp.query(listings, params.jsonpath)
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
    const newListing = {
      ...listingDto,
      property: plainToClass(PropertyCreateDto, listingDto.status),
    }
    const listingContext = { listing: newListing, error: null } as ListingContext
    const result = transitionState(listingContext, ListingStatus.pending)

    if (!result.errors) {
      const listing = this.listingRepository.create(newListing)
      return await listing.save()
    } else {
      return result.errors
    }
  }

  async update(listingDto: ListingUpdateDto) {
    const qb = this.getFullyJoinedQueryBuilder()
    qb.where("listings.id = :id", { id: listingDto.id })
    const listing = await qb.getOne()

    if (!listing) {
      throw new NotFoundException()
    }
    listingDto.units.forEach((unit) => {
      if (unit.id.length === 0 || unit.id === "undefined") {
        delete unit.id
      }
    })
    // Don't assign status, state machine will handle it
    const newStatus = listingDto.status
    listingDto.status = listing.status
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
    const listingContext = { listing: listing, error: null } as ListingContext
    const result = transitionState(listingContext, newStatus)
    if (!result.errors) {
      return await this.listingRepository.save(listing)
    } else {
      return result.errors
    }
  }

  async delete(listingId: string) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingId },
    })
    return await this.listingRepository.remove(listing)
  }

  async findOne(listingId: string, lang: Language = Language.en) {
    const result = await this.getFullyJoinedQueryBuilder()
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "preferences.ordinal": "ASC",
      })
      .getOne()
    if (!result) {
      throw new NotFoundException()
    }
    if (lang !== Language.en) {
      await this.translationService.translateListing(result, lang)
    }

    return result
  }
}

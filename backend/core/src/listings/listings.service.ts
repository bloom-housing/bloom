import { Injectable, NotFoundException } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import {
  ListingDto,
  ListingCreateDto,
  ListingUpdateDto,
  PaginatedListingsDto,
  ListingFilterParams,
  filterTypeToFieldMap,
  ListingsQueryParams,
} from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { plainToClass } from "class-transformer"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { arrayIndex } from "../libs/arrayLib"
import { mapTo } from "../shared/mapTo"
import { addFilters } from "../shared/filter"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly listingRepository: Repository<Listing>) {}

  private getFullyJoinedQueryBuilder() {
    return this.listingRepository
      .createQueryBuilder("listings")
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

  public async list(origin: string, params: ListingsQueryParams): Promise<PaginatedListingsDto> {
    // Inner query to get the sorted listing ids of the listings to display
    // TODO(avaleske): Only join the tables we need for the filters that are applied
    const innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      .leftJoin("listings.property", "property")
      .groupBy("listings.id")
      .orderBy({ "listings.id": "DESC" })

    if (params.filter) {
      addFilters<ListingFilterParams, typeof filterTypeToFieldMap>(
        params.filter,
        filterTypeToFieldMap,
        innerFilteredQuery
      )
    }

    const paginationInfo = {
      currentPage: params.page,
      itemCount: undefined as number,
      itemsPerPage: params.limit,
      totalItems: undefined as number,
      totalPages: undefined as number,
    }

    const paginate =
      // CurrentPage and itemsPerPage are read in from the querystring, so we
      // confirm the type before proceeding
      typeof paginationInfo.currentPage === "number" &&
      paginationInfo.currentPage > 0 &&
      typeof paginationInfo.itemsPerPage === "number" &&
      paginationInfo.itemsPerPage > 0
    if (paginate) {
      // Calculate the number of listings to skip (because they belong to lower page numbers).
      const offset = (paginationInfo.currentPage - 1) * paginationInfo.itemsPerPage
      // Add the limit and offset to the inner query, so we only do the full
      // join on the listings we want to show.
      innerFilteredQuery.offset(offset).limit(paginationInfo.itemsPerPage)
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
    paginationInfo.currentPage = paginate ? paginationInfo.currentPage : 1
    paginationInfo.itemCount = listings.length
    paginationInfo.itemsPerPage = paginate ? paginationInfo.itemsPerPage : listings.length
    // Get the total listings count, with filters applied. getCount() ignores any offsets and limits.
    paginationInfo.totalItems = paginate ? await innerFilteredQuery.getCount() : listings.length
    paginationInfo.totalPages = paginate
      ? Math.ceil(paginationInfo.totalItems / paginationInfo.itemsPerPage)
      : 1

    // Get the application counts and map them to listings
    if (origin === process.env.PARTNERS_BASE_URL) {
      const counts = await this.listingRepository
        .createQueryBuilder("listing")
        .select("listing.id")
        .loadRelationCountAndMap("listing.applicationCount", "listing.applications", "applications")
        .getMany()

      const countIndex = arrayIndex<Listing>(counts, "id")

      listings.forEach((listing: Listing) => {
        listing.applicationCount = countIndex[listing.id].applicationCount || 0
      })
    }

    // TODO(https://github.com/CityOfDetroit/bloom/issues/135): Decide whether to remove jsonpath
    if (params.jsonpath) {
      listings = jp.query(listings, params.jsonpath)
    }

    const paginatedListings = {
      items: mapTo<ListingDto, Listing>(ListingDto, listings),
      meta: paginationInfo,
    }

    return paginatedListings
  }

  async create(listingDto: ListingCreateDto) {
    const listing = this.listingRepository.create({
      ...listingDto,
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
    listingDto.units.forEach((unit) => {
      if (unit.id.length === 0 || unit.id === "undefined") {
        delete unit.id
      }
    })
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

    return await this.listingRepository.save(listing)
  }

  async delete(listingId: string) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingId },
    })
    return await this.listingRepository.remove(listing)
  }

  async findOne(listingId: string) {
    const result = await this.getFullyJoinedQueryBuilder()
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "preferences.ordinal": "ASC",
      })
      .getOne()
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }
}

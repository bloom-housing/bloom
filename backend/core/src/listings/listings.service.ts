import { Injectable, NotFoundException } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import {
  ListingDto,
  ListingCreateDto,
  ListingUpdateDto,
  PaginatedListingsDto,
  ListingFilterParams,
} from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { plainToClass } from "class-transformer"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { arrayIndex } from "../libs/arrayLib"
import { ListingsQueryParams } from "./listings.controller"
import { mapTo } from "../shared/mapTo"
import { addFilter } from "../shared/filter"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly listingRepository: Repository<Listing>) {}

  private getQueryBuilder() {
    return this.listingRepository
      .createQueryBuilder("listings")
      .leftJoinAndSelect("listings.image", "image")
      .leftJoinAndSelect("listings.result", "result")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .leftJoinAndSelect("listings.jurisdiction", "jurisdiction")
      .leftJoinAndSelect("listings.reservedCommunityType", "reservedCommunityType")
  }

  public async list(origin: string, params: ListingsQueryParams): Promise<PaginatedListingsDto> {
    let qb = this.getQueryBuilder()
    if (params.filter) {
      addFilter<ListingFilterParams>(params.filter, "listings", qb)
    }

    qb.orderBy({
      "listings.id": "DESC",
    })

    let currentPage: number = params.page
    let itemsPerPage: number = params.limit

    let itemCount: number, totalItemsCount: number, totalPages: number
    let listings: Listing[]

    if (currentPage > 0 && itemsPerPage > 0) {
      // Calculate the number of listings to skip (because they belong to lower page numbers)
      const skip = (currentPage - 1) * itemsPerPage
      qb = qb.skip(skip).take(itemsPerPage)

      listings = await qb.getMany()

      itemCount = listings.length

      // Issue a separate "COUNT(*) from listings;" query to get the total listings count.
      totalItemsCount = await this.listingRepository.count()
      totalPages = Math.ceil(totalItemsCount / itemsPerPage)
    } else {
      // If currentPage or itemsPerPage aren't specified (or are invalid), issue the SQL query to
      // get all listings (no pagination).
      listings = await qb.getMany()

      currentPage = 1
      totalPages = 1
      itemCount = listings.length
      itemsPerPage = listings.length
      totalItemsCount = listings.length
    }

    // Sort units and preferences.
    // This step was removed from the SQL query because it interferes with pagination
    // (See https://github.com/CityOfDetroit/affordable-housing-app/issues/88#issuecomment-865329223)
    listings.forEach((listing) => {
      listing.property.units.sort((a, b) => a.maxOccupancy - b.maxOccupancy)
      listing.preferences.sort((a, b) => a.ordinal - b.ordinal)
    })

    /**
     * Get the application counts and map them to listings
     */
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

    // TODO(https://github.com/CityOfDetroit/bloom/issues/135): decide whether to remove jsonpath
    if (params.jsonpath) {
      listings = jp.query(listings, params.jsonpath)
    }

    const paginatedListings = {
      items: mapTo<ListingDto, Listing>(ListingDto, listings),
      meta: {
        currentPage: currentPage,
        itemCount: itemCount,
        itemsPerPage: itemsPerPage,
        totalItems: totalItemsCount,
        totalPages: totalPages,
      },
    }

    return paginatedListings
  }

  async create(listingDto: ListingCreateDto) {
    const listing = Listing.create({
      ...listingDto,
      property: plainToClass(PropertyCreateDto, listingDto),
    })
    return this.listingRepository.save(listing)
  }

  async update(listingDto: ListingUpdateDto) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingDto.id },
      relations: ["property"],
    })
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
    const result = await this.getQueryBuilder()
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

import { Injectable, NotFoundException } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import { ListingCreateDto, ListingUpdateDto, ListingFilterParams } from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { addFilter } from "../shared/filter"
import { plainToClass } from "class-transformer"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { arrayIndex } from "../libs/arrayLib"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly listingRepository: Repository<Listing>) {}

  private getQueryBuilder() {
    return Listing.createQueryBuilder("listings")
      .leftJoinAndSelect("listings.image", "image")
      .leftJoinAndSelect("listings.result", "result")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.unitTypeRef", "unitTypeRef")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .leftJoinAndSelect("listings.jurisdiction", "jurisdiction")
      .leftJoinAndSelect("listings.reservedCommunityType", "reservedCommunityType")
  }

  public async list(
    origin: string,
    jsonpath?: string,
    filter?: ListingFilterParams[]
  ): Promise<Listing[]> {
    const qb = this.getQueryBuilder()
    if (filter) {
      addFilter<ListingFilterParams>(filter, "listings", qb)
    }

    qb.orderBy({
      "listings.id": "DESC",
      "units.max_occupancy": "ASC",
      "preferences.ordinal": "ASC",
    })

    let listings = await qb.getMany()

    /**
     * Get the application counts and map them to listings
     */
    if (origin === process.env.PARTNERS_BASE_URL) {
      const counts = await Listing.createQueryBuilder("listing")
        .select("listing.id")
        .loadRelationCountAndMap("listing.applicationCount", "listing.applications", "applications")
        .getMany()

      const countIndex = arrayIndex<Listing>(counts, "id")

      listings.forEach((listing: Listing) => {
        listing.applicationCount = countIndex[listing.id].applicationCount || 0
      })
    }

    if (jsonpath) {
      listings = jp.query(listings, jsonpath)
    }
    return listings
  }

  async create(listingDto: ListingCreateDto) {
    const listing = Listing.create({
      ...listingDto,
      property: plainToClass(PropertyCreateDto, listingDto),
    })
    return await listing.save()
  }

  async update(listingDto: ListingUpdateDto) {
    const listing = await Listing.findOne({
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
    const listing = await Listing.findOneOrFail({
      where: { id: listingId },
    })
    return await Listing.remove(listing)
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

import { Injectable } from "@nestjs/common"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"
import jp from "jsonpath"

import { plainToClass } from "class-transformer"
import { ListingCreateDto } from "./listing.create.dto"
import { Listing } from "../entity/listing.entity"
import { ListingUpdateDto } from "./listings.update.dto"

export enum ListingsResponseStatus {
  ok = "ok",
}

@Injectable()
export class ListingsService {
  public async list(jsonpath?: string): Promise<any> {
    let listings = await Listing.createQueryBuilder("listings")
      .leftJoinAndSelect("listings.units", "units")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.assets", "assets")
      .leftJoinAndSelect("listings.applicationMethods", "applicationMethods")
      .orderBy({
        "listings.id": "DESC",
        "units.max_occupancy": "ASC",
      })
      .getMany()

    if (jsonpath) {
      listings = jp.query(listings, jsonpath)
    }

    listings.forEach((listing) => {
      if (listing.units.length) {
        listing.unitsSummarized = transformUnits(listing.units, amiCharts)
      }
      listing.urlSlug = listingUrlSlug(listing)
    })

    const data = {
      status: ListingsResponseStatus.ok,
      listings: listings,
      amiCharts: amiCharts,
    }

    return data
  }

  async create(listingDto: ListingCreateDto) {
    const listing = plainToClass(Listing, listingDto)
    await listing.save()
    return listing
  }

  async update(listingDto: ListingUpdateDto) {
    const listing = await Listing.findOneOrFail({
      where: { id: listingDto.id },
    })
    Object.assign(listing, listingDto)
    await listing.save()
    return listing
  }

  async delete(listingId: string) {
    const listing = await Listing.findOneOrFail({
      where: { id: listingId },
    })
    return await Listing.remove(listing)
  }

  async findOne(listingId: string) {
    return await Listing.findOneOrFail({
      where: {
        id: listingId,
      },
      relations: ["units", "preferences", "assets", "applicationMethods"],
    })
  }
}

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Listing } from "../entity/Listing"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"
import jp from "jsonpath"
import { ApiProperty } from "@nestjs/swagger"

export class ListingsQueryParams {
  @ApiProperty({ required: false })
  jsonpath?: string
}

export enum ListingsResponseStatus {
  ok = "ok",
}

export class ListingsFindAllResponse {
  @ApiProperty({ enum: ListingsResponseStatus })
  status: ListingsResponseStatus

  @ApiProperty({ isArray: true, type: Listing })
  listings: Listing[]

  @ApiProperty({ isArray: true })
  amiCharts: any
}

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly repo: Repository<Listing>) {}

  public async findAll(options?: ListingsQueryParams): Promise<ListingsFindAllResponse> {
    let listings = await this.repo.find({ relations: ["units", "attachments", "preferences"] })

    if (options?.jsonpath) {
      listings = jp.query(listings, options.jsonpath)
    }

    listings.forEach((listing) => {
      listing.unitsSummarized = transformUnits(listing.units, amiCharts)
      listing.urlSlug = listingUrlSlug(listing)
    })

    const data: ListingsFindAllResponse = {
      status: ListingsResponseStatus.ok,
      listings: listings,
      amiCharts: amiCharts,
    }

    return data
  }
}

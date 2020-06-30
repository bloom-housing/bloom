import { Injectable } from "@nestjs/common"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"
import jp from "jsonpath"
import { ListingsListQueryParams, ListingsListResponse } from "./listings.dto"
import { Listing } from "../entity/listing.entity"

export enum ListingsResponseStatus {
  ok = "ok",
}

@Injectable()
export class ListingsService {
  public async list(options?: ListingsListQueryParams): Promise<ListingsListResponse> {
    let listings = await Listing.find({ relations: ["units", "attachments", "preferences"] })

    if (options?.jsonpath) {
      listings = jp.query(listings, options.jsonpath)
    }

    listings.forEach((listing) => {
      listing.unitsSummarized = transformUnits(listing.units, amiCharts)
      listing.urlSlug = listingUrlSlug(listing)
    })

    const data: ListingsListResponse = {
      status: ListingsResponseStatus.ok,
      listings: listings,
      amiCharts: amiCharts,
    }

    return data
  }
}

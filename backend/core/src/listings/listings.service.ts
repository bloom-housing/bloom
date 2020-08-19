import { getConnection } from "typeorm"
import { Injectable } from "@nestjs/common"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"
import jp from "jsonpath"

import { ListingsListResponse } from "./listings.dto"
import { Listing } from "../entity/listing.entity"
import { translateEntity } from "../lib/translations"

export enum ListingsResponseStatus {
  ok = "ok",
}

function transformListing(listing: Listing): Listing {
  listing.unitsSummarized = transformUnits(listing.units, amiCharts)
  listing.urlSlug = listingUrlSlug(listing)
  listing = translateEntity(listing)
  return listing
}

@Injectable()
export class ListingsService {
  public async list(jsonpath?: string, language?: string): Promise<ListingsListResponse> {
    let listings = await getConnection()
      .createQueryBuilder(Listing, "listing")
      .leftJoinAndSelect("listing.units", "units")
      .leftJoinAndSelect("listing.attachments", "attachments")
      .leftJoinAndSelect("listing.preferences", "preferences")
      .leftJoinAndSelect(
        "listing.translations",
        "translations",
        "translations.languageCode = :code",
        { code: language }
      )
      .getMany()

    if (jsonpath) {
      listings = jp.query(listings, jsonpath)
    }

    const data: ListingsListResponse = {
      status: ListingsResponseStatus.ok,
      listings: listings.map(transformListing),
      amiCharts: amiCharts,
    }

    return data
  }
}

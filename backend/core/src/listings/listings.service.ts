import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"
import jp from "jsonpath"
import { InjectRepository } from "@nestjs/typeorm"

import { ListingsListResponse } from "./listings.dto"
import { Listing } from "../entity/listing.entity"
import { translateEntity, appendGenericVersionsOfLanguages } from "../lib/translations"

export enum ListingsResponseStatus {
  ok = "ok",
}

function transformListing(listing: Listing, languages?: string[]): Listing {
  listing.unitsSummarized = transformUnits(listing.units, amiCharts)
  listing.urlSlug = listingUrlSlug(listing)
  listing = translateEntity(listing, languages)
  return listing
}

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly repo: Repository<Listing>) {}
  public async list(jsonpath?: string, languages?: string[]): Promise<ListingsListResponse> {
    let listings = await this.repo
      .createQueryBuilder("listing")
      .leftJoinAndSelect("listing.units", "units")
      .leftJoinAndSelect("listing.attachments", "attachments")
      .leftJoinAndSelect("listing.preferences", "preferences")
      .leftJoinAndSelect(
        "listing.translations",
        "translations",
        "translations.languageCode = ANY(:codes)",
        { codes: appendGenericVersionsOfLanguages(languages) }
      )
      .getMany()

    if (jsonpath) {
      listings = jp.query(listings, jsonpath)
    }

    const data: ListingsListResponse = {
      status: ListingsResponseStatus.ok,
      listings: listings.map((l) => transformListing(l, languages)),
      amiCharts: amiCharts,
    }

    return data
  }
}

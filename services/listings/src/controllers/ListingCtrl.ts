import { Controller, Get, Property, PropertyType, QueryParams } from "@tsed/common"
import jp from "jsonpath"
import { Inject, Injectable } from "@tsed/di"
import { Returns } from "@tsed/swagger"

import { Listing } from "@bloom-housing/core"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"
import listingsLoader from "../lib/listings_loader"
import { CONNECTION } from "../index"
import { Connection } from "typeorm"
import { ListingModel } from "../entity/Listing"

export class QueryParamsModel {
  @Property()
  jsonpath: string
}

export class ListingsResponseModel {
  @Property()
  status: string

  @PropertyType(ListingModel)
  listings: ListingModel[]

  @Property()
  amiCharts
}

@Controller("/")
export class ListingCtrl {
  constructor(@Inject(CONNECTION) private readonly connection: Connection) {}

  @Get()
  @Returns(ListingsResponseModel)
  async findAll(@QueryParams() params: QueryParamsModel): Promise<ListingsResponseModel> {
    const repository = this.connection.getRepository(ListingModel)
    let listings = await repository.find({ relations: ["units", "attachments", "preferences"] })
    if (params.jsonpath) {
      listings = jp.query(listings, params.jsonpath)
    }
    listings.forEach((listing) => {
      listing.unitsSummarized = transformUnits(listing.units, amiCharts)
    })

    const data = {
      status: "ok",
      listings: listings,
      amiCharts: amiCharts,
    }
    return data
  }
}

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Listing } from "../entity/Listing"
import { amiCharts } from "../lib/ami_charts"
import { transformUnits } from "../lib/unit_transformations"
import { listingUrlSlug } from "../lib/url_helper"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly repo: Repository<Listing>) {}

  public async findAll() {
    const listings = await this.repo.find({ relations: ["units", "attachments", "preferences"] })
    listings.forEach((listing) => {
      listing.unitsSummarized = transformUnits(listing.units, amiCharts)
      listing.urlSlug = listingUrlSlug(listing)
    })

    const data = {
      status: "ok",
      listings: listings,
      amiCharts: amiCharts,
    }
    return data
  }
}

import { SelectQueryBuilder } from "typeorm"
import { summarizeUnitsByTypeAndRent } from "../../shared/units-transformations"
import { Listing } from "../entities/listing.entity"
import { views } from "./config"
import { View } from "./types"

export class BaseView {
  qb: SelectQueryBuilder<Listing>
  view: View
  constructor(qb: SelectQueryBuilder<Listing>) {
    this.qb = qb
    this.view = views.base
  }

  getView(): SelectQueryBuilder<Listing> {
    this.qb.select(this.view.select)

    this.view.leftJoins.forEach((join) => {
      this.qb.leftJoin(join.join, join.alias)
    })

    return this.qb
  }

  mapUnitSummary(listings) {
    return listings.map((listing) => ({
      ...listing,
      unitsSummarized: {
        byUnitTypeAndRent: summarizeUnitsByTypeAndRent(listing.property.units),
      },
    }))
  }
}

export class DetailView extends BaseView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.detail
  }
}

export class FullView extends BaseView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.full
  }

  getView(): SelectQueryBuilder<Listing> {
    this.view.leftJoinAndSelect.forEach((tuple) => this.qb.leftJoinAndSelect(...tuple))

    return this.qb
  }
}

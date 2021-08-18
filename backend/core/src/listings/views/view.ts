import { SelectQueryBuilder } from "typeorm"
import { summarizeUnitsByTypeAndRent } from "../../shared/units-transformations"
import { Listing } from "../entities/listing.entity"
import { views } from "./config"
import { View } from "./types"

export function getView(qb: SelectQueryBuilder<Listing>, view?: string) {
  switch (views[view]) {
    case views.detail:
      return new DetailView(qb)
    case views.full:
      return new FullView(qb)
    default:
      return new BaseView(qb)
  }
}

export class BaseView {
  qb: SelectQueryBuilder<Listing>
  view: View
  constructor(qb: SelectQueryBuilder<Listing>) {
    this.qb = qb
    this.view = views.base
  }

  getViewQb(): SelectQueryBuilder<Listing> {
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

  getViewQb(): SelectQueryBuilder<Listing> {
    this.view.leftJoinAndSelect.forEach((tuple) => this.qb.leftJoinAndSelect(...tuple))

    return this.qb
  }
}

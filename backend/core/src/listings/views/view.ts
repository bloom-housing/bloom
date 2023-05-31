import { summarizeUnitsByTypeAndRent } from "../../shared/units-transformations"
import { views } from "./config"
import { View, BaseView } from "../../views/base.view"
import { ListingsQueryBuilder } from "../db/listing-query-builder"

export function getView(qb: ListingsQueryBuilder, view?: string) {
  switch (views[view]) {
    case views.base:
      return new BaseListingView(qb)
    case views.detail:
      return new DetailView(qb)
    case views.listingsExport:
      return new ListingsExportView(qb)
    case views.unitsExport:
      return new UnitsExportView(qb)
    case views.full:
    default:
      return new FullView(qb)
  }
}

export class BaseListingView extends BaseView {
  qb: ListingsQueryBuilder
  view: View
  constructor(qb: ListingsQueryBuilder) {
    super(qb)
    this.view = views.base
  }

  getViewQb(): ListingsQueryBuilder {
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
        byUnitTypeAndRent: summarizeUnitsByTypeAndRent(listing.units, listing),
      },
    }))
  }
}

export class DetailView extends BaseListingView {
  constructor(qb: ListingsQueryBuilder) {
    super(qb)
    this.view = views.detail
  }
}
export class ListingsExportView extends BaseListingView {
  constructor(qb: ListingsQueryBuilder) {
    super(qb)
    this.view = views.listingsExport
  }
}

export class UnitsExportView extends BaseListingView {
  constructor(qb: ListingsQueryBuilder) {
    super(qb)
    this.view = views.unitsExport
  }
}

export class FullView extends BaseListingView {
  constructor(qb: ListingsQueryBuilder) {
    super(qb)
    this.view = views.full
  }

  getViewQb(): ListingsQueryBuilder {
    this.view.leftJoinAndSelect.forEach((tuple) => this.qb.leftJoinAndSelect(...tuple))

    return this.qb
  }
}

import { SelectQueryBuilder } from "typeorm"
import { Application } from "../entities/application.entity"
import { views } from "./config"
import { View, BaseView } from "../../views/base.view"

export function getView(qb: SelectQueryBuilder<Application>, view?: string) {
  switch (views[view]) {
    case views.partnerList:
      return new PartnerList(qb)
    default:
      return new BaseApplicationView(qb)
  }
}

export class BaseApplicationView extends BaseView {
  qb: SelectQueryBuilder<Application>
  view: View
  constructor(qb: SelectQueryBuilder<Application>) {
    super(qb)
    this.view = views.base
  }

  getViewQb(): SelectQueryBuilder<Application> {
    this.view.leftJoins.forEach(({ join, alias }) => this.qb.leftJoinAndSelect(join, alias))

    return this.qb
  }
}

export class PartnerList extends BaseApplicationView {
  constructor(qb: SelectQueryBuilder<Application>) {
    super(qb)
    this.view = views.partnerList
  }

  // getViewQb(): SelectQueryBuilder<Application> {
  //   this.qb.select(this.view.select)

  //   this.view.leftJoins.forEach((join) => {
  //     this.qb.leftJoin(join.join, join.alias)
  //   })

  //   return this.qb
  // }
}

import { SelectQueryBuilder } from "typeorm"

export interface View {
  select?: string[]
  leftJoins?: {
    join: string
    alias: string
  }[]
  leftJoinAndSelect?: [string, string][]
}

export class BaseView {
  qb: SelectQueryBuilder<any>
  view: View
  constructor(qb: SelectQueryBuilder<any>) {
    this.qb = qb
    this.view = undefined
  }

  getViewQb(): SelectQueryBuilder<any> {
    this.qb.select(this.view.select)

    this.view.leftJoins.forEach((join) => {
      this.qb.leftJoin(join.join, join.alias)
    })

    return this.qb
  }
}

export const getBaseAddressSelect = (schemas: string[]): string[] => {
  const fields = [
    "city",
    "county",
    "state",
    "street",
    "street2",
    "zipCode",
    "latitude",
    "longitude",
  ]

  let select: string[] = []
  schemas.forEach((schema) => {
    select = select.concat(fields.map((field) => `${schema}.${field}`))
  })
  return select
}

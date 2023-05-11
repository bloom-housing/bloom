import {
  CombinedListingFilterParams,
  EnumCombinedListingFilterParamsComparison,
  OrderByFieldsEnum,
  OrderParam,
} from "@bloom-housing/backend-core"

type OrderBy = {
  field: OrderByFieldsEnum
  direction: OrderParam
}

type OrderByParams = {
  fields: OrderByFieldsEnum[]
  direction: OrderParam[]
}

export class ListingQueryBuilder {
  filters: Filter[] = []
  orderBy: OrderBy[] = []

  addFilter(
    field: string,
    comparison: EnumCombinedListingFilterParamsComparison,
    value: string | string[]
  ) {
    this.filters.push(new Filter(field, comparison, value))
    return this
  }

  whereEqual(field: string, value: string) {
    return this.addFilter(field, EnumCombinedListingFilterParamsComparison["="], value)
  }

  whereNotEqual(field: string, value: string) {
    return this.addFilter(field, EnumCombinedListingFilterParamsComparison["<>"], value)
  }

  whereIn(field: string, value: string[]) {
    return this.addFilter(field, EnumCombinedListingFilterParamsComparison["IN"], value)
  }

  whereGreaterThanEqual(field: string, value: string) {
    return this.addFilter(field, EnumCombinedListingFilterParamsComparison[">="], value)
  }

  addOrderBy(field: OrderByFieldsEnum, direction: OrderParam) {
    this.orderBy.push({
      field: field,
      direction: direction,
    })
    return this
  }

  getFilterParams(): CombinedListingFilterParams[] {
    return this.filters.map((filter) => {
      return filter.toFilterParams()
    })
  }

  getOrderByParams(): OrderByParams {
    if (this.orderBy.length < 1) {
      return
    }

    const params = {
      fields: null,
      direction: null,
    }

    this.orderBy.forEach((orderBy) => {
      params.fields.push(orderBy.field)
      params.direction.push(orderBy.direction)
    })

    return params
  }
}

class Filter {
  field: string
  comparison: EnumCombinedListingFilterParamsComparison
  value: string | string[]

  constructor(
    field: string,
    comparison: EnumCombinedListingFilterParamsComparison,
    value: string[] | string
  ) {
    this.field = field
    this.comparison = comparison
    this.value = value
  }

  toFilterParams(): CombinedListingFilterParams {
    // Set the comparison type
    const value = {
      $comparison: this.comparison,
    }

    // Set the value that we're searching for
    value[this.field] = this.value

    return value
  }
}

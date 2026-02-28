import {
  EnumListingFilterParamsComparison,
  ListingFilterParams,
  ListingOrderByKeys,
  OrderByEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type OrderBy = {
  field: ListingOrderByKeys
  direction: OrderByEnum
}

type OrderByParams = {
  fields: ListingOrderByKeys[]
  direction: OrderByEnum[]
}

export class ListingQueryBuilder {
  filters: Filter[] = []
  orderBy: OrderBy[] = []

  addFilter(
    field: string,
    comparison: EnumListingFilterParamsComparison,
    value: string | string[]
  ) {
    this.filters.push(new Filter(field, comparison, value))
    return this
  }

  // We use these convenience methods to keep from polluting files with references
  // to EnumCombinedListingFilterParamsComparison, which will likely change once
  // external listings are no longer required.

  whereEqual(field: string, value: string) {
    return this.addFilter(field, EnumListingFilterParamsComparison["="], value)
  }

  whereNotEqual(field: string, value: string) {
    return this.addFilter(field, EnumListingFilterParamsComparison["<>"], value)
  }

  whereLike(field: string, value: string) {
    return this.addFilter(field, EnumListingFilterParamsComparison["LIKE"], value)
  }

  whereIn(field: string, value: string[]) {
    return this.addFilter(field, EnumListingFilterParamsComparison["IN"], value)
  }

  whereGreaterThanEqual(field: string, value: string) {
    return this.addFilter(field, EnumListingFilterParamsComparison[">="], value)
  }

  whereLessThanEqual(field: string, value: string) {
    return this.addFilter(field, EnumListingFilterParamsComparison["<="], value)
  }

  addOrderBy(field: ListingOrderByKeys, direction: OrderByEnum) {
    this.orderBy.push({
      field: field,
      direction: direction,
    })
    return this
  }

  getFilterParams(): ListingFilterParams[] {
    return this.filters.map((filter) => {
      return filter.toFilterParams()
    })
  }

  getOrderByParams(): OrderByParams {
    if (this.orderBy.length < 1) {
      return
    }

    const params = {
      fields: [],
      direction: [],
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
  comparison: EnumListingFilterParamsComparison
  value: string | string[]

  constructor(
    field: string,
    comparison: EnumListingFilterParamsComparison,
    value: string[] | string
  ) {
    this.field = field
    this.comparison = comparison
    this.value = value
  }

  toFilterParams(): ListingFilterParams {
    // Set the comparison type
    const value = {
      $comparison: this.comparison,
    }

    // Set the value that we're searching for
    value[this.field] = this.value

    return value
  }
}

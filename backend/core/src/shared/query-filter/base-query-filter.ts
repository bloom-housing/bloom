import { HttpException, HttpStatus } from "@nestjs/common"
import { Compare } from "../dto/filter.dto"
import { WhereExpression } from "typeorm"
import { IBaseQueryFilter } from "./index"

export class BaseQueryFilter implements IBaseQueryFilter {
  protected static _shouldSkipKey(filter, filterKey) {
    return (
      filter[filterKey] === undefined || filter[filterKey] === null || filterKey === "$comparison"
    )
  }
  protected static _isSupportedFilterTypeOrThrow<FilterFieldMap>(
    filterType,
    filterTypeToFieldMap: FilterFieldMap
  ) {
    if (!(filterType in filterTypeToFieldMap)) {
      throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
    }
  }
  protected static _getComparisonOperator(filter) {
    return filter["$comparison"]
  }

  protected static _getFilterField<FilterFieldMap>(
    filterKey,
    filterTypeToFieldMap: FilterFieldMap
  ) {
    return filterTypeToFieldMap[filterKey]
  }

  protected static _getFilterValue(filter, filterKey) {
    return filter[filterKey]
  }

  protected static _getWhereParameterName(filterKey, index) {
    return `${filterKey}_${index}`
  }

  protected static _compare(qb, filter, filterKey, filterTypeToFieldMap, index) {
    const whereParameterName = BaseQueryFilter._getWhereParameterName(filterKey, index)
    const filterField = BaseQueryFilter._getFilterField(filterKey, filterTypeToFieldMap)
    const filterValue = BaseQueryFilter._getFilterValue(filter, filterKey)
    const comparison = BaseQueryFilter._getComparisonOperator(filter)
    switch (comparison) {
      case Compare.IN:
        qb.andWhere(`LOWER(CAST(${filterField} as text)) IN (:...${whereParameterName})`, {
          [whereParameterName]: filterValue
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s.length !== 0),
        })
        break
      case Compare["<>"]:
      case Compare["="]:
      case Compare[">="]:
        qb.andWhere(
          `LOWER(CAST(${filterField} as text)) ${comparison} LOWER(:${whereParameterName})`,
          {
            [whereParameterName]: filterValue,
          }
        )
        break
      case Compare.NA:
        // If we're here, it's because we expected this filter to be handled by a custom filter handler
        // that ignores the $comparison param, but it was not.
        throw new HttpException(
          `Filter "${filter}" expected to be handled by a custom filter handler, but one was not implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
      default:
        throw new HttpException("Comparison Not Implemented", HttpStatus.NOT_IMPLEMENTED)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addFilters<FilterParams extends any[], FilterFieldMap>(
    filters: FilterParams,
    filterTypeToFieldMap: FilterFieldMap,
    qb: WhereExpression
  ) {
    for (const [index, filter] of filters.entries()) {
      for (const filterKey in filter) {
        if (BaseQueryFilter._shouldSkipKey(filter, filterKey)) {
          continue
        }
        BaseQueryFilter._isSupportedFilterTypeOrThrow(filterKey, filterTypeToFieldMap)
        BaseQueryFilter._compare(qb, filter, filterKey, filterTypeToFieldMap, index)
      }
    }
  }
}

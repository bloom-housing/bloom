import { HttpException, HttpStatus } from "@nestjs/common"
import { WhereExpression } from "typeorm"

/**
 *
 * @param filterParams
 * @param filterTypeToFieldMap
 * @param innerQb The inner query on which filters are applied.
 * @param whereParameters Passes out the whereParamters used for the inner query.
 */
/**
 * Add filters to provided QueryBuilder, using the provided map to find the field name.
 * The order of the params matters:
 * - A $comparison must be first.
 * - Comparisons in $comparison will be applied to each filter in order.
 * Passing out the WHERE parameters is necessary due to a bug in TypeORM: The
 * WHERE params are dropped from the inner query, so they must be added to the
 * outer query manually.
 */
export function addFilters<FilterParams, FilterFieldMap>(
  filterParams: FilterParams,
  filterTypeToFieldMap: FilterFieldMap,
  innerQb: WhereExpression,
  whereParameters: { [key: string]: string }
): void {
  let comparisons: string[],
    comparisonCount = 0

  // TODO(#210): This assumes that the order of keys is consistent across browsers,
  // that the key order is the insertion order, and that the $comaprison field is first.
  // This may not always be the case.
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType === "$comparison") {
      if (Array.isArray(value)) {
        comparisons = value
      } else if (typeof value == "string") {
        comparisons = [value]
      }
    } else {
      if (value !== undefined) {
        let values: string[]
        // handle multiple values for the same key
        if (Array.isArray(value)) {
          values = value
        } else if (typeof value == "string") {
          values = [value]
        }

        const comparisonsForCurrentFilter = comparisons.slice(
          comparisonCount,
          comparisonCount + values.length
        )
        comparisonCount += values.length

        // Throw if this is not a supported filter type
        if (!(filterType.toLowerCase() in filterTypeToFieldMap)) {
          throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
        }

        values.forEach((val: string, i: number) => {
          // Each WHERE param must be unique across the entire QueryBuilder
          const whereParameterName = `${filterType}_${i}`
          innerQb.andWhere(
            `LOWER(${filterTypeToFieldMap[filterType.toLowerCase()]}) ${
              comparisonsForCurrentFilter[i]
            } LOWER(:${whereParameterName})`,
            {
              [whereParameterName]: val,
            }
          )
          whereParameters[whereParameterName] = val
        })
      }
    }
  }
}

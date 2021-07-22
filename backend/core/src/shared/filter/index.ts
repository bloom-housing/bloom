import { HttpException, HttpStatus } from "@nestjs/common"
import { WhereExpression } from "typeorm"
import { Filters } from "../../shared/dto/filter.dto"

/**
 *
 * @param filter
 * @param schema
 * @param qb
 */
/**
 * This is super simple right now, but we can expand to include complex filter with ands, ors, more than one schema, etc
 */
export function addFilter<Filter>(filter: Filter, schema: string, qb: WhereExpression): void {
  const operator = "andWhere"
  /**
   * By specifying that the filter is an array, it keeps the keys in order, so we can iterate like below
   */
  let comparisons: unknown[],
    comparisonCount = 0

  // TODO(#210): This assumes that the order of keys is consistent across browsers,
  // that the key order is the insertion order, and that the $comaprison field is first.
  // This may not always be the case.
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const key in filter) {
    const value = filter[key]
    if (key === "$comparison") {
      if (Array.isArray(value)) {
        comparisons = value
      } else {
        comparisons = [value]
      }
    } else {
      if (value !== undefined) {
        let values
        // handle multiple values for the same key
        if (Array.isArray(value)) {
          values = value
        } else {
          values = [value]
        }

        // TODO(#202): Refactor this out into a provided map, so addFilter() is generic again
        switch (key.toUpperCase()) {
          case Filters.status:
          case Filters.name:
            addFilterClause(values, key)
            break
          case Filters.neighborhood:
            values.forEach((val: unknown) => {
              // TODO add support for multiple neighborhoods by using a sub orWhere expression
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              qb[operator](`property.neighborhood ${comparisons[comparisonCount]} :neighborhood`, {
                neighborhood: val,
              })
              comparisonCount++
            })
            break
          default:
            throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
        }
      }
    }
  }

  function addFilterClause(values: [string], key: string) {
    values.forEach((val: unknown) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      qb[operator](`${schema}.${key} ${comparisons[comparisonCount]} :${key}`, {
        [key]: val,
      })
      comparisonCount++
    })
  }
}

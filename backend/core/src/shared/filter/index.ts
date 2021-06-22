import { WhereExpression } from "typeorm"

/**
 *
 * @param filter
 * @param schema
 * @param qb
 */
/**
 * This is super simple right now, but we can expand to include complex filter with ands, ors, more than one schema, etc
 */
export function addFilter<Filter>(filter: Filter[], schema: string, qb: WhereExpression): void {
  const operator = "andWhere"
  /**
   * By specifying that the filter is an array, it keeps the keys in order, so we can iterate like below
   */
  let comparisons: unknown[],
    comparisonCount = 0

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

        values.forEach((val: unknown) => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          qb[operator](`${schema}.${key} ${comparisons[comparisonCount]} :${key}`, {
            [key]: val,
          })
          comparisonCount++
        })
      }
    }
  }
}

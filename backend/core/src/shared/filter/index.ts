import { WhereExpression } from "typeorm"

export type Operators = "=" | "<>"

/**
 *
 * @param filter
 * @param qb
 */
/**
 * This is super simple right now, but we can expand to include complex filter with ands, ors, more than one schema, etc
 */
export function addFilter<Filter>(filter: Filter[], schema: string, qb: WhereExpression): void {
  const mainOperator = "andWhere"
  if (filter === undefined || filter === null) {
    return
  }

  for (const obj of filter) {
    const key = Object.keys(obj).filter((key: string) => key !== "operator")[0]

    qb[mainOperator](`${schema}.${key} ${obj["operator"]} :${key}`, {
      [key]: obj[key],
    })
  }
}
